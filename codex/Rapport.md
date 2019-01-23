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

## Resource shared
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
### Frontend choices
We chose Ant Design React because of all the features available, it's a clear and professional design. 

Our pages handle pagination through infinite scroll. 

The selection radio buttons are all directly visible from the wall as we thought that developers know exactly what they are looking for and this should be chosen with one click.

### Backend choices

To store the data shared across  the platform, it appeared clear to us to use elasticsearch as it is based on Lucene and could fit the best our requirements which are :

- The content shared across the platform is small portions of code, thus textual
- Programming languages have several reserved word which are often irrelevant when searching specific use cases
- Queries have to be fast to have a good user experience with the frontend. This can be done with the inverted index used in elastic searching

As it is unnecessary to store the users informations in elasticsearch, we chose a simple and powerful Google service FireBase

- The Firestore Cloud database stores user related content
- FireBase also allows easy authentication mechanism with Firebase



The programming language chosen is javascript with elasticsearch.js library and express for the REST API.

Documents stored :

* Posts  : the main data exchanged, contains : id, title, description, content, tags, author_id, author name

* Tags : we store tags globally to help users find content (with autocompletion)

  

* Users :  picture, nickname, email, password, identifier

### Usage walkthrough

* The user registers to the sign up page
  * The user can directly access the wall page without confirmation
* The user is now able to create posts, search for posts through different fields
* From any posts, the user can click on the tag to see related posts (tag page)
  * The user can subscribe to a tag when on a tag page

* Profile page is accessible to modify personal data, see subscriptions

### Tests

* Database content verification with Kibana
* Simple shell script testing on concurrent clap incrementation shown that `retryOnConflict` has to be set to to avoid misbehaviors (set it to 5).

