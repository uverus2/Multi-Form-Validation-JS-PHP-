<?php

if(isset($_POST['id'])){
    $myfile = fopen("db.txt", "r") or die("Unable to open file!");

    $arrayFromFile = file('db.txt');

    // Trims each array value
    foreach ($arrayFromFile as $key => $value) {
        $arrayFromFile[$key] = trim ($value);
    }

    $containSearchTerm = $_POST['id'];

    if(in_array($containSearchTerm, $arrayFromFile)){
        $inArray = array_search($containSearchTerm, $arrayFromFile);
        var_dump($inArray);
        array_splice($arrayFromFile, $inArray, 4 );

        $filterArray = array_filter($arrayFromFile);
    
        print_r($filterArray);
    
        fclose($myfile);
    
        $myfile = fopen("db.txt", "w") or die("Unable to open file!");
    
        // To ensure double \n is added to the end of each form data
        $counter = 1;
        foreach ($filterArray as $value) {
    
            if($counter%4 == 0){
                fwrite($myfile, $value."\n\n");
            }else{
                fwrite($myfile, $value."\n");
            }
            $counter++;
        }
        fclose($myfile);
    }

}
?>