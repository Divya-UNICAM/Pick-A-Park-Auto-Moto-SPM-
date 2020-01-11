# pick-a-park-api
RESTful API for the Unicam SPM project "Pick-a-Park"

##### Notes: 
**some commits in day 10/12/19 have been already published in a [test repository](https://github.com/VincenzoNucci/pick-a-park-api) so they were simply merged from it**

#### Agenda of the sprint
The initial team velocity defined was 15, considering an optimistic workflow, and the sum of story points to achieve in this sprint was 13.
Later, due to problems with the chosen technologies, we refactored the sprint plan, starting again from the beginning with a week-long sprint. The following is a log of what we did on each day of this week.

* **08/12/19 - Change in technology**
After some researches, we decided to move the project from a Java environment to a JS,HTML,CSS due to its simplicity and lower learning curve.
* **09/12/19 - First server-side tests**
After one day, the server was providing basic functionalities that we immediately tested in order to have a tool for verifying future services implementation.
* **10/12/19 - Home page**
The home page for the server is released and now, functionalities like registering a new users are mocked in the application.
* **11/12/19 - Request page**
The client interface now has the possibility to issue a request for a parking place through its own page, integrated with the request api service.
* **12/12/19 - Payment mock**
The user requesting a parking slot will now be asked for payment. This functionality has been implemented using the paypal sdk.
* **13/12/19 - Wrapping up and deliver**
On last but one day of the sprint we tested each functionality and wrapped up together pages and services in order to prepare a demo.
* **14/12/19 - Sprint review**
On the last day of the sprint we will discuss about what we achieved in this sprint, the obstacles met during the week and how we can improve the process in order to increase the velocity and achieve more story points.

We would like to point out that we could not have constantly used the daily stand-up meeting technique due to one team member having family problems, we instead made hour-long calls when had the opportunity and needed help.
One thing we can improve for the next sprint is to arrange stand-up meetings daily.

### User Stories
We wrote the user stories in a Google Sheet document [available here](https://docs.google.com/spreadsheets/d/1CT56THMKohscO8FBVuiHBV9Dpm8neEXZE4Pcw-vWUB8/edit?usp=sharing)
The log of the selected user stories for the sprint is available in json format under the directory *issues*.
Each json file contains the events timeline of each user story, up to this day Friday 13 December 2019.


### Demo
To try the application the commands to run are
```
git clone https://github.com/UNICAM-CS/sprint-w7-auto-moto.git
npm install
npm start
```
Now the interface should be visible in [localhost:3001](http://localhost:3001)

Instead of downloading and running the app, one could also go to [https://automoto-pick-a-park-api.herokuapp.com/](https://automoto-pick-a-park-api.herokuapp.com/) and try a deployed version of the interface