# /bin/zsh

# Fetch EC2 image data and save it to describe-instances.json
aws ec2 describe-images --owners amazon > describe-instances.json

# Navigate to the CDK directory
cd cdk

# Install necessary packages
npm install

# Bootstrap the CDK environment
cdk bootstrap --require-approval never

# Deploy all CDK stacks
cdk deploy --all --require-approval never

# Invoke the Lambda function
aws lambda invoke \
  --function-name json-handler \
  --payload '{}' \
  --output json \
  response.json