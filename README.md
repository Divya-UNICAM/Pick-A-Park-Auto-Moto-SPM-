# pick-a-park-api
RESTful API for the Unicam SPM project "Pick-a-Park"

#### Agenda of the sprint
When defining the team velocity for this sprint, we considered that, based on the previous sprint, we should stick around 10 (in the optimistic case); so given that we should stay a little below the actual velocity, we decided the sum of story points to achieve in this sprint, to be 9.
The following is a log of what we did on each day of this week-long sprint.

* **15/12/19 - Operative plan**
On the first day of the sprint, we planned what to do: create a page displaying the route to the destination and build a mock page for the administrators dashboard.
* **16/12/19 - Login and sign-up**
The day after we implemented a page for adding users and a page for enabling users to enter their management page.
* **17/12/19 - Dashboard page mock and login validation**
The dashboard (management) page for users is released, but functionalities like adding sensors or parking places are still not mocked in the application.
* **18/12/19 - User geolocation in parking request**
The client interface now doesn't need anymore to ask the starting location when issuing a request for a parking place, thanks to HTML5 geolocation.
* **19/12/19 - Obtaining directions and displaying the route page**
After the user pays for a parking place, directions are created from freely available apis and then the route to the parking place is shown in a map.
* **20/12/19 - Wrapping up and deliver**
On last but one day of the sprint we tested each functionality and wrapped up together pages and services in order to prepare a demo.
* **21/12/19 - Sprint review**
On the last day of the sprint we will discuss about what we achieved in this sprint, the obstacles met during the week and how we can improve the process in order to increase the velocity and achieve more story points.

We would like to point out that even for this sprint we could not have constantly used the daily stand-up meeting technique due to one team member going to Naples for having medical examinations.
One thing we can improve for the next sprint is to arrange stand-up meetings daily.

### User Stories
We wrote the user stories in a Google Sheet document [available here](https://docs.google.com/spreadsheets/d/1CT56THMKohscO8FBVuiHBV9Dpm8neEXZE4Pcw-vWUB8/edit?usp=sharing)
The log of the selected user stories for the sprint is available in json format under the directory *issues*.
Each json file contains the events timeline of each user story, up to this day Friday 20 December 2019.


### Demo
To try the application the commands to run are
```
git clone https://github.com/UNICAM-CS/sprint-w8-auto-moto.git
npm install
npm start
```
Now the interface should be visible in [localhost:3001](http://localhost:3001)