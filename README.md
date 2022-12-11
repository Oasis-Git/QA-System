# QA-System
This is our group project code for Software Engineering course. The team includes: Yuwei An(leader), Ziyue Dang, Zihan Song, Wenbo Xv, Zixuan Han.
## Project Function
This is a software which has similar function with other Question-Answer Website like Reddit and Zhihu. The software could be applied in PC and mobile device.
We also developed mobile phone Application in Android framework. 
There are two roles in the software: administrator and user
### Administrator
#### root administrator
The root administrator is the administrator with the highest authority in the system, and there is only one administrator in the system. The administrator can modify the password and other system configuration after logging in
Also, the root administator could add new normal administrator to help them manage the software. It has all the function normal one owns.
#### normal administrator
The normal administrator is mainly responsible for reviewing respondent application and reviewing Q&A order. Any non-compliant applications and orders would be revoked and deleted by normal administator.
This role could only be setup by root.
### User
#### Questioner
Anyone who has finished sign up process could submit questions. Because our application focuses on target one on one QA order, your order should include: the one you want to ask questions whose information and ranking are public, the payment and 
the main body of question. Our software support markdown translate, file and image upload. 
#### Respondent
The respondent should apply their position and own the oppurtunity to answer questions only when approved by Administrator. The respondent could modify their professional information and expected payment.
Once they received order, they could choose whether to answer or not. If they choose to answer, they should answer the question round by round until the questioner is satisfied.
## Code Structure
### Database and Backend
We used PgSql as our main database system and Spring in Java as our backend framework. The work is mainly done by Yuwei An.
### Communication and Enviornment Development
The communication protocal and API is designed by Wenbo Xv. He is also responsible for the project development.
### Website Frontend
We used React in TypeScript as our main framework in Website frontend. Ziyue Dang and Zixuan Han are mainly responsible for this part.
### Android Frontend
We also implemented our software on Android platform. The part is maily responsible by Zisong Han
