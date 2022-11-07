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

    public function update(string $table, array $data, array $whereClause, array $fillable) : int
    {
        $values = [];
        foreach($data as $key => $value) {
            if(! in_array($key, $fillable)) {
                unset($data[$key]);
                continue;
            }
            $values[] = $key.'=:'.$key;
            $data[':'.$key] = $value;
            unset($data[$key]);
        }

        $where = [];
        foreach($whereClause as $key => $value) {
            $where[] = $key.'=:wc'.$key;
            $whereClause[':wc'.$key] = $value;
            unset($whereClause[$key]);
        }

        $sql = sprintf('update %s set '.implode(',', $values).' where '.implode('and', $where), $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute(array_merge($data, $whereClause));
            $query->fetch(PDO::FETCH_OBJ);
            
            return $query->rowCount();

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return 0;
        }
    }

    public function selectById(string $table, int $id, array $relations) : ? Object
    {
        if(empty($relations)) {
            $sql = sprintf('select * from %s where id = :id limit 1', $table);
        } else {
            $sql = 'select '.$table.'.*, '.implode(',', $relations['fields']).' from '.$table.' ';
            unset($relations['fields']);
            foreach($relations as $relation) {
                $sql .= $relation['join'].' '.$relation['table'].' on '. $relation['on'].' ';
            }
            $sql .= 'where '.$table.'.id=:id ';
            $sql .= 'order by '.$table.'.id asc';
        }
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute([':id' => $id]);
            $result = $query->fetch(PDO::FETCH_OBJ);
            
            return $result ? $result : null;

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return null;
        }
    }

    public function selectAll(string $table) : ? array
    {
        $sql = sprintf('select * from %s order by id asc', $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_OBJ);
            
            return $result;

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return null;
        }
    }


    public function delete(string $table, array $whereClause) : int
    {

        $where = [];
        foreach($whereClause as $key => $value) {
            $where[] = $key.'=:wc'.$key;
            $whereClause[':wc'.$key] = $value;
            unset($whereClause[$key]);
        }

        $sql = sprintf('delete from %s where '.implode('and', $where), $table);
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute($whereClause);
            $query->fetch(PDO::FETCH_OBJ);
            
            return $query->rowCount();

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return 0;
        }
    }

    public function allWithRelations(string $table, array $relations) : ?array
    {
        $sql = 'select ';
        $sql .= $table == isset($relations['distinct']) ? 'distinct ' : '';
        $sql .= $table.'.*, '.implode(',', $relations['fields']).' from '.$table.' ';
        unset($relations['fields'], $relations['distinct']);
        foreach($relations as $relation) {
            $sql .= $relation['join'].' '.$relation['table'].' on '. $relation['on'].' ';
        }
        $sql .= 'order by '.$table.'.id asc';
        
        try {
            $query = $this->con->prepare($sql);
            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_OBJ);
            
            return $result;

        } catch(PDOException $e) {
            error_log($e->getMessage(), 3 ,__DIR__.'/../errors.log');
            return null;
        }
    }
}