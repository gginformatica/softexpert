<?php
class Controller {
    protected $url, $id, $action;

    public function __construct($action = null) {
        // echo $_SERVER['REQUEST_METHOD'];
        $this->action = $action;

        $this->doAction();
    }

    private function doAction() {
        if($this->action) {
            $action = $this->action;
            $this->$action();
            return;
        }
        $this->index();
    }

    protected function throw($data) {
        header('content-type:text/json');
        print($data);
        die;
    }

    protected function throwError($data) {
        header('content-type:text/json');
        http_response_code(422);
        print($data);
        die;
    }

    protected function validate($post, $rules = null) {
        $errors = [];
        $required_list = $rules ?? $this->required;
        foreach($required_list as $required) {
            if (!isset($post[$required]) || empty($post[$required])) {
                $errors['errors'][$required] = 'Campo obrigatório!';
            }
        }
        return $errors;
    }
}