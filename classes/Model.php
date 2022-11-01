<?php
class Model {
    public $id;
    private $query = NULL;
    private $queryTable = NULL;
    private static $self = NULL;

    public function __construct($id = null) {
        $this->id = $id;
        if($id && is_numeric($id)) {
            $info = (Array) self::find($this->id);
            foreach($info as $key => $value) {
                if($key !== 'id' && $key !== 'password')
                    $this->{$key} = $value; // Create dynamic properties
            }
        }
    }

    public static function all(): ?array
    {
        $db = new Database();
        return $db->selectAll(static::$table);
    }

    public static function create(array $args) : ?Object
    {
        $db = new Database();
        $id = $db->insert(static::$table, $args, static::$fillable);
        return self::find($id);
    }

    public static function find(int $id) : ?Object
    {
        $db = new Database();
        return $db->selectById(static::$table, $id);
    }
}