<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    // Make a conntection to the DB Server
    // TODO: Put actual credentials before uploading
    $servername = "";
    $username = "";
    $password = "";
    $dbname = "";
    
    $conn = new mysqli($servername, $username, $password, $dbname);

    if (mysqli_connect_error()) {
        die("Database connection failed: " . mysqli_connect_error());
    }

    // Do Business on the DB and prepare the $ret JSON string
    
    function createNewUserAndAddToCommunity($conn, $uid, $communitycode, $firstname){
        $stmt = $conn->prepare("insert into users (uid, communitycode, firstname) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $uid, $communitycode, $firstname);
        $stmt->execute();
        $stmt->close();        
        return '{"status":"success"}';
    }
    
    function putCross($conn, $uid, $dayseq, $crossid){
        $stmt = $conn->prepare("insert into crosses (uid, dayseq, crossid) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $uid, $dayseq, $crossid);
        $stmt->execute();
        $stmt->close();        
        return '{"status":"success"}';    
    }
    
    function getUserData($conn, $uid){
                
        // firstname, communitycode
        $stmt = $conn->prepare("select firstname, communitycode from users where uid=?");        
        $stmt->bind_param("s", $uid);
        $stmt->execute();
        $stmt->bind_result($firstname, $communitycode);
        $stmt->fetch();
        $stmt->close();
        
        // array of crossses ordered by dayseq
        $stmt2 = $conn->prepare("select dayseq, crossid from crosses where uid=?  order by dayseq");
        
        $stmt2->bind_param("s", $uid);
        $stmt2->execute();                
        $stmt2->bind_result($dayseq, $crossid);
        $crosses = array();
        while ($stmt2->fetch()) {
            $crosses[$dayseq] = $crossid;
        }
        $stmt2->close();
        
        // fill the array with -1 if there is no cross
        for ($dayseq = 0; $dayseq < 46; $dayseq++){
            if (empty($crosses[$dayseq])){
                $crosses[$dayseq] = -1;
            }
        }
        
        // convert into array
        $jsonArr = '[';
        for ($dayseq = 0; $dayseq < 46; $dayseq++){
            if ($jsonArr != "[") {$jsonArr .= ",";}
            $jsonArr .= $crosses[$dayseq];
        }
        $jsonArr .="]";
        
        // find the community cross count also
        $communitycount = getCommunityCrossCount_($conn, $communitycode);
        
        return '{"status":"success",'.
        '"firstname":"'.$firstname.'",'.
        '"communitycode":"'.$communitycode.'",'.
        '"crossesByDay":'.$jsonArr.','.
        '"communitycount":'.$communitycount.
        '}';    
    
    }
    
    function getCommunityCrossCount_($conn, $communitycode){
        $stmt = $conn->prepare("select count(*) from crosses where uid in (select uid from users where communitycode=?)");        
        $stmt->bind_param("s", $communitycode);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        return $count;
    }
    
    function getCommunityCrossCount($conn, $communitycode){
        $count = getCommunityCrossCount_($conn, $communitycode);
        return '{"status":"success","count":'.$count.'}';
    }
    
    $method = $_GET['method'];
                
    switch ($method){
        case "createNewUserAndAddToCommunity":            
            $ret = createNewUserAndAddToCommunity($conn, $_GET['uid'], $_GET['communitycode'], $_GET['firstname']);
            break;
        case "putCross":
            $ret = putCross($conn, $_GET['uid'], $_GET['dayseq'], $_GET['crossid']);
            break;
        case "getUserData":
            $ret = getUserData($conn, $_GET['uid']);
            break;
        case "getCommunityCrossCount":
            $ret = getCommunityCrossCount($conn, $_GET['communitycode']);
            break;
        default: 
            $ret = '{"status":"error"}';
            break;
    }
    
    // Close DB connection
    $conn->close();

    // Dispatch -- no echo statements before this
    header('content-type: application/json; charset=utf-8');
    header("access-control-allow-origin: *");    
    echo($ret);
    
?>