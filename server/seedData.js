const mongoose = require("mongoose");
const Topic = require("./models/Topic");
const Problem = require("./models/Problem");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const topicsData = [
  { name: "Arrays", description: "Learn about arrays" },
  { name: "Linked List", description: "Learn about linked lists" },
  { name: "Stacks & Queues", description: "Learn about stacks and queues" }
];

const problemsData = [
  {
    topic: "Arrays",
    problems: [
      {
        title: "Two Sum",
        description: "Find two numbers that sum to target",
        level: "easy",
        youtubeLink: "https://youtube.com/example1",
        leetcodeLink: "https://leetcode.com/problems/two-sum/",
        articleLink: "https://example.com/two-sum"
      },
      {
        title: "Maximum Subarray",
        description: "Find contiguous subarray with maximum sum",
        level: "medium",
        youtubeLink: "https://youtube.com/example2",
        leetcodeLink: "https://leetcode.com/problems/maximum-subarray/",
        articleLink: "https://example.com/maximum-subarray"
      }
    ]
  },
  {
    topic: "Linked List",
    problems: [
      {
        title: "Reverse Linked List",
        description: "Reverse a singly linked list",
        level: "easy",
        youtubeLink: "https://youtube.com/example3",
        leetcodeLink: "https://leetcode.com/problems/reverse-linked-list/",
        articleLink: "https://example.com/reverse-linked-list"
      }
    ]
  }
];

async function seed() {
  await Topic.deleteMany({});
  await Problem.deleteMany({});

  for (let t of topicsData) {
    const topic = await Topic.create(t);
    const problemSet = problemsData.find(p => p.topic === t.name);
    if (problemSet) {
      for (let p of problemSet.problems) {
        await Problem.create({ ...p, topicId: topic._id });
      }
    }
  }

  console.log("Seeding done!");
  mongoose.connection.close();
}

seed();
