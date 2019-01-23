Pierre-Samuel Rochat, Joël Kaufmann & Arnold von Bauer Gauss

# TWEB/MAC Project

## Subject
A social network to share samples of code between developers.
Each member can share/post short samples of code for other members to copy/paste in their projects.
The members can subscribe to a subject via an # annotation to display related content on their "wall".
They can also search content or members by using this annotation or plain text queries.
Results are then sorted by accuracy and "claps" (a variant of "likes" used by the Medium website).

For example, if a user searches for "react proptypes", a list of code samples featuring
React PropTypes usage, sorted by quality/relevance is returned.

## Resource
The users share Markdown formatted code. They also provide a brief title and description. Additionally, they provide hashtags (#) that describe the content of their publication.

## Technologies
- Frontend: ReactJS
- REST API: Express
- Main database: Elasticsearch
- Users database: Firestore
- Authentication: Firebase

## TWEB functionalities
- Sign In / Sign Up pages
- Profile page (info + edit)
- Wall page (displays content to which the user is subscribed)
- Post/Publish page (form)
- API endpoints to get required data
- API endpoints to create users/content

## MAC functionalities
- Search for content related to a hashtag (#)
- Search content using plain text queries (queries applied on a single field)
- Filter and sort content (claps, date, word occurrence or not)
- API endpoints to get notifications related data
- API for queries, annotations and users related data

## Deployment
- Frontend: Zeit Now
- Backend: Heroku
- Database: probably GCP (Google Cloud Platform)

## Report

### Frontend

### Backend
