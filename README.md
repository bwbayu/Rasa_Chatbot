# Dependency

# Error
1. DucklingEntityExtractor for extracting value is still error because i need to run the server 
2. "Explanation" response doesn't work

# Next
1. deploy

# Important Information
1. multi intent = https://rasa.com/docs/rasa/tuning-your-model#doing-multi-intent-classification
2. pre-trained embeddings in pipeline = https://rasa.com/docs/rasa/tuning-your-model#pre-trained-embeddings
3. testing model using test-stories = 
- https://rasa.com/docs/rasa/testing-your-assistant#writing-test-stories
- https://rasa.com/docs/rasa/testing-your-assistant#evaluating-a-dialogue-model
- https://rasa.com/docs/rasa/testing-your-assistant#how-to-write-test-cases
4. evaluating NLU model = https://rasa.com/docs/rasa/testing-your-assistant#evaluating-an-nlu-model
5. testing with different pipelines = https://rasa.com/docs/rasa/testing-your-assistant#comparing-nlu-pipelines
6. deploy = https://rasa.com/docs/rasa/setting-up-ci-cd#github-actions-ci-pipeline

# Important Commands
- run actions server : rasa run actions -v
- run rasa server : rasa run --enable-api --cors "*"
- run rasa server + tracker : rasa run --endpoints endpoints.yml --enable-api --cors "*"
- split dataset nlu : rasa data split nlu
- train dataset nlu : rasa train nlu -u .\train_test_split\training_data.yml
- test dataset nlu : rasa test nlu -m .\models\nlu-20240229-161334-round-alfalfa.tar.gz -u .\train_test_split\test_data.yml or rasa test nlu --nlu train_test_split/test_data.yml
- cross validation : rasa test nlu  --nlu data/nlu --cross-validation --folds 5
- testing stories : rasa test

# Deployment
1. Docker
2. Kubernetes