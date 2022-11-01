<?php
class Database {
    protected $con;

    public function __construct() {
        $connection = 'pgsql:host='.$_ENV['DB_HOST'].';port='.$_ENV['DB_PORT'].';dbname='.$_ENV['DB_NAME'].';';
        try {
            $this->con = new \PDO($connection, $_ENV['DB_USERNAME'], $_ENV['DB_PASSWORD'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            
        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }

    public function insert(string $table, array $data, array $fillable) : int
    {
        $columns = implode(', ', array_keys($data));
        foreach($data as $key => $value) {
            if(! in_array($key, $fillable)) {
                unset($data[$key]);
                continue;
            }
            $data[':'.$key] = $value;
            unset($data[$key]);
        }

        $sql = sprintf('insert into %s ('.$columns.') values ('.implode(', ', array_keys($data)).') RETURNING id', $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute($data);
            $result = $query->fetch(PDO::FETCH_OBJ);
            
            return $result->id;

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return 0;
        }
    }

    public function selectById(string $table, int $id) : ? Object
    {
        $sql = sprintf('select * from %s where id = :id limit 1', $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute([':id' => $id]);
            $result = $query->fetch(PDO::FETCH_OBJ);
            
            return $result;

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return 0;
        }
    }

    public function selectAll(string $table) : ? array
    {
        $sql = sprintf('select * from %s', $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_OBJ);
            
            return $result;

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return 0;
        }
    }
}