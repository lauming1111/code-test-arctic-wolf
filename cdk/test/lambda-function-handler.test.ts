import { Context } from "aws-lambda/handler";
import { handler } from "../lambda-functions/handler";
import 'dotenv/config';

;


describe("Lambda Function Local Test", () => {
    let context: Context;
    it("should get JSON from S3", async () => {
        // Test with no event data
        const response = await handler(null, context!);

        // Assert the response
        expect(response).not.toBeNull;
        // console.log(JSON.stringify(response));

        // expect(JSON.parse(response.body)).toEqual({ message: "hello world" });
    }, 3 * 60 * 1000);
});