<?php
    header('content-type: application/json; charset=utf-8');
    header("access-control-allow-origin: *");
    echo file_get_contents("contentData.json");
?>