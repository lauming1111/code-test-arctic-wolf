import { Context } from "aws-lambda/handler";
import { handler } from "../lambda-functions/handler";
import * as fs from "fs";

import 'dotenv/config';
const AWS = require("aws-sdk");
const s3 = new AWS.S3();


describe("Lambda Function Local Test", () => {
    let context: Context;
    const expectedAnswer1 = JSON.parse(fs.readFileSync('./test/answer_1.json', 'utf8'));
    const expectedAnswer2 = JSON.parse(fs.readFileSync('./test/answer_2.json', 'utf8'));
    const expectedAnswer3 = JSON.parse(fs.readFileSync('./test/answer_3.json', 'utf8'));
    it("should get JSON from S3", async () => {
        // Test with no event data
        const response = await handler(null, context!);

        // Assert the response
        expect(response).not.toBeNull;
        // console.log(JSON.stringify(response));

        // expect(JSON.parse(response.body)).toEqual({ message: "hello world" });
    }, 3 * 60 * 1000);


    it("should get answer 1 JSON from S3", async () => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: 'answer_1.json',
        };

        // Fetch the JSON file from S3
        const data = await s3.getObject(params).promise();
        const jsonData = JSON.parse(data.Body.toString("utf-8"));
        console.log(jsonData);

        // Assert the response
        expect(jsonData).toEqual(expectedAnswer1);
    }, 3 * 60 * 1000);

    it("should get answer 2 JSON from S3", async () => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: 'answer_2.json',
        };

        // Fetch the JSON file from S3
        const data = await s3.getObject(params).promise();
        const jsonData = JSON.parse(data.Body.toString("utf-8"));
        console.log(jsonData);

        // Assert the response
        expect(jsonData).toEqual(expectedAnswer2);
    }, 3 * 60 * 1000);

    it("should get answer 3 JSON from S3", async () => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: 'answer_3.json',
        };

        // Fetch the JSON file from S3
        const data = await s3.getObject(params).promise();
        const jsonData = JSON.parse(data.Body.toString("utf-8"));
        console.log(jsonData);

        // Assert the response
        expect(jsonData).toEqual(expectedAnswer3);
    }, 3 * 60 * 1000);
});