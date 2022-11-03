<?php
class Controller {
    use ParamsResolverTrait;

    protected $url, $id, $action;
    private array $post;

    public function __construct(string $action = null) {
        $resourcePath = self::resolveResourcePath();
        list ($url, $id, $action) = self::resolveParams(...explode('/', $resourcePath));
        // die($_SERVER['REQUEST_METHOD']);
        switch(strtolower($_SERVER['REQUEST_METHOD'])) {
            case 'post':
                if($id) {
                    $this->action = 'update';
                    $this->post = $_POST;
                    $this->id = $id;
                    break;
                }
                $this->action = 'store';
                $this->post = $_POST;
                break;
            case 'delete':
                $this->action = 'destroy';
                $this->id = $id;
                break;
            default:
                $this->action = $action;
        }

        $this->doAction();
    }

    private function doAction() {
        if($this->action) {
            $action = $this->action;
            
            if(isset($this->post) && count($this->post)) {
                if($this->id) {
                    $modelObject = new $this->model($this->id);
                    $this->$action($modelObject, $this->post);
                    return;
                }
                $this->$action($this->post);
                return;
            } elseif($this->id) {
                $modelObject = new $this->model($this->id);
                $this->$action($modelObject);
                return;
            }
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