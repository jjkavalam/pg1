DB Design
---------
Three tables
    communities - code (VARCHAR 1000), description (VARCHAR 1000)
    users - uid (VARCHAR 1000), communitycode (VARCHAR 1000), firstname (VARCHAR 1000)
    crosses - uid (VARCHAR 1000), dayseq (INT), crossid (INT)

Methods used by App
    
    createNewUserAndAddToCommunity (uuid, communitycode) --> 
        insert into users (uid, communitycode, firstname) values (?, ?, ?)

    putCross (uid, dayseq, cross) -->
        "insert into crosses (uid, dayseq, cross) values (?, ?, ?)"
        
    getUserData (uuid) --> 
        firstname: "select firstname from users where uid = ?"
        communitycode: "select communitycode from users where uid=?"
        crosses: "select dayseq, crossid from crosses where uuid=?"
        --> Convert this to a Array inserting undefines where necessary
        individualCrosscount: "select count(*) from crosses where uid=?"
        communityCrosscount: (use method below)

    getCommunityCrossCount (class) -->
        "select count(*) from crosses where uid in (select uid from users where communitycode=?)"
        
Story board 
-----------
Scene 1
* What will I do today ?
* All that I have done this week and before ?
* What more to go ?

Scene 2
* Choose what to do ?
* Turn my choice into reward

Scene 3
* My actions add goodness to my class
* Others in my class are also doing good things

Details
-------
This Lent I will show my love for Jesus by doing something for him each day. To show what I have done, I will color a cross each day to match one of the good deeds below.

Actions:
Green Cross - I said an extra prayer for Jesus
Purple Cross - I helped someone for Jesus
Red Cross - I did something good that was hard for me to do for Jesus
Yellow Cross - I did what I was supposed to do without being told for Jesus

Jobin is prayerful.

Jobin helped someone in need.

Jobin bettered himself by doing something that was previously hard

Jobin did his part without being told

Story is all about "Action and its Reward"
Action is a cross --> Reward is Easter