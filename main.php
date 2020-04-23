<?php

  class Validator {

    public function __construct(string $formID, string $name,int $phone, string $email)
    {
        $this->formID = $formID;
        $this->name = $name;
        $this->phone = $phone;
        $this->email = $email;
    }

    private $errors = array();

    public function getErrors() {
      if(count($this->errors) > 0){
        array_unshift($this->errors,$this->formID);
      }
      return $this->errors;
    }

    public function getValues(){
      return [$this->formID,$this->name,$this->email,$this->phone];
    }

    private function name($name){
      $checkName = "/^[a-zA-Z\s]*$/";

      if(preg_match($checkName, $name) && strlen($name) > 0){
        return;
      }else{
        array_push($this->errors,"name");
      }
    }

    private function phone($phone){
      $checkNumber = "/^\d{10}$/";
      if(preg_match($checkNumber, $phone)){
        return;
      }else{
        array_push($this->errors,"phone");
      }
    }

    private function email($email){
      $checkEmail = "/\S+@\S+\.\S+/";

      if(preg_match($checkEmail, $email)){
        return;
      }else{
        array_push($this->errors,"email");
      }
    }

    public function validate(){
      $this->name($this->name);
      $this->email($this->email);
      $this->phone($this->phone);
    }
  }

  $data = file_get_contents('php://input');

  $data2 = json_decode($data,true);

  $allErrors = array();
  $formObjects = array();
  foreach ($data2 as $value) {
    $form = new Validator($value[0], $value[1], intval($value[2]), $value[3]);
    $values = $form->validate();
    $errors = $form->getErrors();

    if(count($errors) > 0){
      array_push($allErrors,$errors);
    }else{
      $formObjects[] = $form->getValues();
    }
  }

  if(count($allErrors) > 0){
    $errorObject = new stdClass;
    $errorObject->errors=$allErrors;
    $errors = json_encode($errorObject);
    http_response_code(401);
    echo $errors;
  }else{
    $formData = json_encode($formObjects);
    $myfile = fopen("db.txt", "w");
    
    foreach ($formObjects as $value) {
       fwrite($myfile, $value[0]."\n");
       fwrite($myfile, $value[1]."\n");
       fwrite($myfile, $value[2]."\n");
       fwrite($myfile, $value[3]."\n\n");
    }

    fclose($myfile);


    echo $formData;
  }
?>
