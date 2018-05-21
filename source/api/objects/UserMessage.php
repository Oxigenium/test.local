<?php

// include defines
include_once '../../config/defines.php';

class UserMessage
{
    private $conn;
    private $table_name = DB_TABLE_NAME_USERBOOK;

    public $userName;
    public $email;
    public $homepage;
    public $text;
    public $ip;
    public $userAgent;

    public $sortBy;
    public $sortDirection;
    public $page;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // add message
    function add(){

        // query to insert record
        $query ="INSERT INTO 
                    {$this->table_name}
                SET
                    username=:username,
                    email=:email,
                    homepage=:homepage,
                    text=:text,
                    ip=:ip,
                    useragent=:useragent
                ";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->userName=htmlspecialchars(strip_tags($this->userName));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->homepage=is_null($this->homepage) ? null : htmlspecialchars(strip_tags($this->homepage));
        $this->text=htmlspecialchars(strip_tags($this->text));
        $this->ip=htmlspecialchars($this->ip);
        $this->userAgent=htmlspecialchars($this->userAgent);

        // bind values
        $stmt->bindValue(":username", $this->userName);
        $stmt->bindValue(":email", $this->email);
        $stmt->bindValue(":homepage", $this->homepage);
        $stmt->bindValue(":text", $this->text);
        $stmt->bindValue(":ip", $this->ip);
        $stmt->bindValue(":useragent", $this->userAgent);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function count(){
        $query =" SELECT 
                    COUNT(id) 
                  FROM               
                    {$this->table_name};";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    //read messages
    function read(){
        switch ($this->sortBy)
        {
            case 'username':
            case 'email':
            case 'timestamp':
                $orderColumn = $this->sortBy;
                break;
            default:
                $orderColumn = 'timestamp';
                break;
        }
        $this->sortDirection == 'lifo' ? $order = 'DESC' : $order = 'ASC';

        $this->page = is_numeric($this->page) ? (int) $this->page : 0;
        $offset =  $this->page * 25;

        // select all query
        $query ="SELECT
                    id, username, email, homepage, text, timestamp
                FROM
                    {$this->table_name}
                ORDER BY
                    {$orderColumn} {$order}
                LIMIT
                    {$offset}, 25;";


        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }


}