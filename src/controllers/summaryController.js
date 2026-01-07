import { generateStructuredSummary } from "../ai/summary.js";
import Summary from "../models/Summary.js";
import User from "../models/User.js";
// import { getTopics } from "../ai/summary.js";

function parseLabeledSummary(text) {
  if (!text || typeof text !== "string") {
    return {
      overview: "Summary could not be generated.",
      topics: [],
    };
  }

  const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)\n\s*TOPICS:/i);
  const topicsMatch = text.match(/TOPICS:\s*([\s\S]*)/i);

  const overview = summaryMatch
    ? summaryMatch[1].trim()
    : "Summary could not be generated.";

  let topics = [];
  if (topicsMatch) {
    topics = topicsMatch[1]
      .split("\n")
      .map((t) => t.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  return { overview, topics };
}

export const fileUploadController = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file?.originalname);
    const user = req.user;
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ message: "User not found" });
    }
    if (user.token <= 0) {
      console.log("ERROR : TOKEN LIMIT EXCEEDED");
      return res.status(400).json({ message: "Token limit exceeded. Please upgrade your plan." });
    }
    if (!req.file) {
      console.log("ERROR : PLEASE UPLOAD A FILE");
      return res.status(400).json({ message: "Please upload a file" });
    }
    const file = req.file;
    const { startDate, endDate } = req.body;

    const text = file.buffer.toString("utf-8");

    let messages = text
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line &&
          line.includes("/") && // date exists
          line.includes(",") &&
          line.includes(" - ") &&
          !line.toLowerCase().includes("end-to-end encrypted") &&
          !line.toLowerCase().includes("learn more")
      );

    const start = startDate ? new Date(startDate + "T00:00:00") : null;

    const end = endDate ? new Date(endDate + "T23:59:59.999") : null;
    // console.log("START DATE RAW:", startDate);
    // console.log("END DATE RAW:", endDate);
    // console.log("START OBJ:", start);
    // console.log("END OBJ:", end);
    const filteredMessages = messages.filter((line) => {
      // Take only the date part: "DD/MM/YY"
      const datePart = line.split(",")[0]; // ✅ SAFE
      if (!datePart) return false;

      const [dd, mm, yy] = datePart.split("/").map(Number);
      if (!dd || !mm || !yy) return false;

      const messageDate = new Date(2000 + yy, mm - 1, dd);

      if (start && messageDate < start) return false;
      if (end && messageDate > end) return false;

      return true;
    });

    // console.log(
    //   "FILTERED:",
    //   filteredMessages.length,
    //   "TOTAL:",
    //   messages.length
    // );

    const summaryText = filteredMessages.join("\n");
    // console.log("Chars sent to AI:", summaryText.length);

    const aiResponse = await generateStructuredSummary(summaryText);
    // console.log("AI RESPONSE:", aiResponse);
    // const summaryTopics =await getTopics(aiResponse);
    // console.log("Summary Topics:", summaryTopics);
    const summaryCount = await Summary.countDocuments({ userId: user._id });

    // const title = req.body.title?.trim()
    //   ? req.body.title
    //   : `Untitled ${summaryCount + 1}`;
    const newSummary = await Summary.create({
      userId: user._id,
      title: aiResponse.title,
      summary: aiResponse.summary,
    });
    await User.findByIdAndUpdate(user._id, { token: user.token - 1 });

    return res.status(200).json({
      data: aiResponse,
      status: 200,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log("ERROR : FILE UPLOAD FAILED", error);
    return res.status(500).json({ status: 500, message: "File upload failed" });
  }
};

export const getSummary = async (req, res) => {
  const user = req.user;
  const summaryId = req.params.id;
  if (!user) {
    console.log("ERROR : USER NOT FOUND");
    return res.status(400).json({ status: 400, message: "User not found" });
  }
  if (!summaryId) {
    console.log("ERROR : SUMMARY NOT FOUND");
    return res.status(400).json({ status: 400, message: "Summary not found" });
  }

  const summary = await Summary.findById(summaryId);

  if (summary.userId.toString() !== user._id.toString()) {
    console.log("ERROR : SUMMARY AND USER NOT FOUND");
    return res
      .status(400)
      .json({ status: 400, message: "Summary and user not found" });
  }

  return res.status(200).json({
    data: summary,
    status: 200,
    message: "Summary found",
  });
};

export const updateTitle = async (req, res) => {
  const { title } = req.body;
  const _id = req.params.id;
  const userId = req.user._id;
  const user = req.user;
  if (!user) {
    console.log("ERROR : USER NOT FOUND");
    return res.status(400).json({ status: 400, message: "User not found" });
  }
  if (!title?.trim()) {
    return res.status(400).json({ status: 400, message: "Title required" });
  }

  const summary = await Summary.findOneAndUpdate(
    { _id, userId },
    { title },
    { new: true }
  );

  if (!summary) {
    return res.status(404).json({ status: 404, message: "Summary not found" });
  }

  res.status(201).json({
    title: summary.title,
    status: 201,
    message: "Title updated successfully",
  });
};

export const getTitles = async (req, res) => {
  try {
    const user = req.user;
    const summaries = await Summary.find({ userId: user._id });
    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ status: 400, message: "User not found" });
    }
    const titles = summaries.map((summary) => summary.title);

    return res
      .status(200)
      .json({ data: titles, status: 200, message: "Titles found" });
  } catch (error) {
    console.log("ERROR : GET TITLES FAILED", error);
    return res.status(500).json({ status: 500, message: "Get titles failed" });
  }
};

export const getSummaries = async (req, res) => {
  try {
    const user = req.user;
    const summaries = await Summary.find({ userId: user._id });

    if (!user) {
      console.log("ERROR : USER NOT FOUND");
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    return res
      .status(200)
      .json({ data: summaries, status: 200, message: "Summaries found" });
  } catch (error) {
    console.log("ERROR : GET SUMMARIES FAILED", error);
    return res
      .status(500)
      .json({ status: 500, message: "Get summaries failed" });
  }
};
