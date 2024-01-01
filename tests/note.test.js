import { app, server } from "../index.js";
import request from "supertest";
import mongoose from "mongoose";

let token;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const loginResponse = await request(app).post(`/api/user/login/`).send({
    username: "test",
    password: "test",
  });
  token = loginResponse.headers["set-cookie"]
    .find((cookie) => cookie.split("=")[0] === "auth_token")
    .split(";")[0];
});

afterAll(async () => {
  if (server) {
    server.close();
  }
  await mongoose.disconnect();
});

const newNoteData = Math.random().toString(36).substring(2, 6);
let newNodeId;

describe("Notes Tests ... ", () => {
  test("Creation of a New Note ...", async () => {
    const res = await request(app)
      .post("/api/notes/create/659258994399298a9022d9a4")
      // UserId of `test`
      .set("Cookie", token)
      .send({
        title: `Hello World ${newNoteData}`,
        content: `Happy New Year ${newNoteData}`,
      });
    newNodeId = res.body.data._id;
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Note Created Successfully");
  });

  test("Finding all Notes ...", async () => {
    const res = await request(app)
      .get(
        `/api/notes/getNote/${newNodeId}` // UserId of `test`
      )
      .set("Cookie", token);
    expect(res.body.message).toBe("Note Found Successfully");
    expect(res.body.data).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

  test("Finding all Notes ...", async () => {
    const res = await request(app)
      .get(
        "/api/notes/getNotes/659258994399298a9022d9a4" // UserId of `test`
      )
      .set("Cookie", token);
    expect(res.body.message).toBe("All Notes Found Successfully");
    expect(res.statusCode).toBe(200);
  });

  test("Updating the New Note Created", async () => {
    const res = await request(app)
      .post(`/api/notes/update/${newNodeId}`)
      .set("Cookie", token)
      .send({
        title: "Happy Sad Year" + newNoteData,
        content: "Travel the world" + newNoteData,
      });
    expect(res.body.data.title).toBe("Happy Sad Year" + newNoteData);
    expect(res.body.data.content).toBe("Travel the world" + newNoteData);
  });

  test("Deletion of a New Note ...", async () => {
    const res = await request(app)
      .delete(`/api/notes/delete/${newNodeId}`)
      // UserId of `test`
      .set("Cookie", token)
      .send({
        title: `Hello World ${newNoteData}`,
        content: `Happy New Year ${newNoteData}`,
      });

    expect(res.body.message).toBe("Note Deleted Successfully");
    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe(false);
  });
});

describe("Data Validation Testing", () => {
  test("Title Validation ... ", async () => {
    const res = await request(app)
      .post("/api/notes/create/659258994399298a9022d9a4")
      .set("Cookie", token)
      .send({
        title: "t2",
        content: "Dummy Content which is correct",
      });
    expect(res.body.message).toBe(
      "Note Creation Server Error -> Note validation failed: title: Title must be at least 3 characters long"
    );
    expect(res.statusCode).toBe(404);
  });

  test("Content Validation ... ", async () => {
    const res = await request(app)
      .post("/api/notes/create/659258994399298a9022d9a4")
      .set("Cookie", token)
      .send({
        content: "c2",
        title: "Dummy Title which is correct",
      });
    expect(res.body.message).toBe(
      "Note Creation Server Error -> Note validation failed: content: Content must be at least 10 characters long"
    );
    expect(res.statusCode).toBe(404);
  });

  test("If Title or Content is Empty", async () => {
    const res = await request(app)
      .post("/api/notes/create/659258994399298a9022d9a4")
      .set("Cookie", token)
      .send({
        content: "",
        title: "",
      });
    expect(res.body.message).toBe(
      "Note Creation Server Error -> Note validation failed: title: Please enter a Title for the Note, content: Please enter Content for the Note"
    );
    expect(res.statusCode).toBe(404);
  });
});
