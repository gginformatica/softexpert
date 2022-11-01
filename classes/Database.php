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

    public function insert(string $table, array $data) : int
    {
        $columns = implode(', ', array_keys($data));
        foreach($data as $key => $value) {
            $data[':'.$key] = $value;
            unset($data[$key]);
        }

        $sql = sprintf('insert into %s ('.$columns.') values ('.implode(', ', array_keys($data)).')', $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute($data);
            return $query->rowCount();
        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return 0;
        }
    }
}