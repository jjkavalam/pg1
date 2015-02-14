DB Design
---------
One table  : uuid - class - day_seq - cross - isHeader

Methods
    getClassList (classID) --> "select unique(class) from table"  
    Alphabetically sorted list of unique classes in the table
    
    addUserToClass (uuid, class) --> 
        insert into table (uuid, class, isHeader) values (?, ?, 1)
        
    getUserData (uuid) --> 
        classID: "select class from table where uuid=? AND isHeader=1"
        crosses: "select day_seq, cross from table where uuid=? AND isHeader=0"
        --> Convert this to a Array inserting undefines where necessary       

    putCross (uuid, class, dayseq, cross) -->
        "insert into table (uuid, class, dayseq, cross, isHeader) values (?, ?, ?, ?, 0)"

    getCrossCount (class) -->
        "select count(*) from table where class=? and isHeader=0"
        
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