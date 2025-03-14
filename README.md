# Lambda Exercise Challenge 
*Note: This exercise is designed to be ran in an AWS Free Tier account and should incur no cost. If for any reason this is an issue please contact your recruiter for alternative accomodations.*
![DaveCyclops](./DaveCyclops.png)
## Part 1 - Develop an AWS Lambda function

You’ve been asked by the friendly Dave Cyclops to perform a basic audit of the Amazon Owned EC2 Images that reside in AWS. In this exercise, we ask that you develop an AWS Lambda function that performs some basic data analysis and writes the corresponding results to an S3 bucket. Also please provide any IaC automation (Terraform, CloudFormation, Python, etc.) used in it's deployment.

Take the input file describe-images.json that was generated by using the following command in an AWS account: 
```
aws ec2 describe-images --owners amazon > describe-instances.json
```

Answer the following questions by developing an AWS Lambda function that reads the above input data from an S3 bucket and outputs the answers to the following questions to the same S3 bucket:

1.  How many images will be deprecated in the next 120 days (treat `2023-02-01T00:00:00.000Z` as today’s date)?  Format your answer as a json object. Example show below for an answer of 30 images.  

```
{
  "Answer": 30
}
```

2. List the windows based image names that expire in the coming 90 days (treat `2023-02-01T00:00:00.000Z` as today’s date)? Format your answer as a json object. Example show below.

```
{
  "Answer": [
    "image_1_name",
    "image_2_name"
  ]
}
```

3. Provide a sorted list of Bottlerocket based images, built for Kubernetes, based on their CreationDate with the most recent creation date at the front of the list.  Include their image name (with key `Name`) and their creation date (with key `CreationDate`) in the list.  The creation should follow the date time format in the ISO 8601 format in the UTC time zone (`YYYY-MM-DDThh:mm:ss.sssZ`).  Format your answer as a json object.  Example shown below:

```
{
  "Answer": [
      {
        "Name": "image_1_name",
        "CreationDate": "2021-03-26T11:32:41.000Z"
      },
      {
        "Name": "image_2_name",
        "CreationDate": "2020-03-01T14:35:51.000Z"
      }
  ]
}
```

Have the Lambda read the data and output answers to an S3 bucket who’s name can be configured by an environment variable called `TARGET_S3_BUCKET`.  When the Lambda is run it should read the JSON file from the S3Bucket (`<TARGET_S3_BUCKET>/describe-images.json`), and it should write all the answers to JSON files in the bucket as described below:

1. `<TARGET_S3_BUCKET>/answer_1.json`

2. `<TARGET_S3_BUCKET>/answer_2.json`

3. `<TARGET_S3_BUCKET>/answer_3.json`


## Part 2 - Writeup/README
Provide a README that contains:

- Any assumptions you made when considering the design/deployment of this application

- Instructions on how to deploy this in AWS.  (The idea being, is that one should be able to take these instructions and deploy it to their AWS own account)

- Quick explanation on how you tested the application

- Any additional details that we should consider when reviewing the submission

## Deliverables:
```
├── dso_challenge_response.zip
│   ├── lambda_function.zip
│   ├── README.md
│   ├── (any additional files/scripts/etc.)
```


- `dso_challenge_response.zip` : this is the zipped main deliverable that everything else zipped inside it
- `lambda_function.zip`: zipped lambda function deliverable
- `README.md` README that provides the write up from above
- any additional files (helper scripts/IaC to deploy the lambda function/tests/etc.)

We will run the deployment instructions in a container, so if there are additional tools that needs to be installed in the environment please specify that/provide instructions.

There is a lot of freedom in how you complete this exercise.  Make assumptions as necessary and be prepared to justify those assumptions.  If you have any clarifying questions you can email matthew.cobb@arcticwolf.com or todd.snyder@arcticwolf.com.

*Note: this is a throwaway question to help us understand your knowledge of AWS, programming, etc.  We will not use any of your code for anything other than assessing your skills and discussion during a followup technical interview*
