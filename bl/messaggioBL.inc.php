<?php

class MessaggioBL
{
    public $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // Retrieve messages by user ID
    public function GetMessagesByUserID($userID)
    {
        $query = "SELECT * FROM messaggi WHERE IDUtente = ? ORDER BY DataCreazione DESC";

        $stmt = $this->conn->prepare($query);

        if ($stmt === false) {
            return json_encode(['error' => "Error preparing statement: " . $this->conn->error]);
        }

        $stmt->bind_param("i", $userID);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $messagesData = array();

            while ($row = $result->fetch_assoc()) {
                $messagesData[] = $row;
            }

            return json_encode($messagesData);
        } else {
            return json_encode(['error' => "Error executing statement: " . $stmt->error]);
        }

        $stmt->close();
    }



    // prende l'ultima data del messaggio da una conversazione
    
    public function GetLastMessageDateByConversationID($conversationID)
    {
        // SQL query to get the last message date in the desired format
        $query = "
        SELECT 
            DATE_FORMAT(MAX(DataCreazione), '%Y-%m-%d %H:%i:%s') AS LastMessageDate
        FROM 
            messaggi 
        WHERE 
            IDConversazione = ?
    ";

        // Prepare the SQL statement
        $stmt = $this->conn->prepare($query);

        if ($stmt === false) {
            return json_encode(['error' => "Error preparing statement: " . $this->conn->error]);
        }

        // Bind the conversation ID parameter
        $stmt->bind_param("i", $conversationID);

        // Execute the query
        if ($stmt->execute()) {
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                return json_encode(['LastMessageDate' => $row['LastMessageDate']]);
            } else {
                return json_encode(['error' => "No data found"]);
            }
        } else {
            return json_encode(['error' => "Error executing statement: " . $stmt->error]);
        }

        // Close the statement
        $stmt->close();
    }



    public function GetMessagesByConversationIDBetweenTwoDates($conversationID, $date1, $date2)
    {
        $query = "SELECT m.IDUtente, m.Contenuto, m.DataCreazione
        FROM conversazioni as c
        JOIN messaggi as m ON m.IDConversazione = c.ID
        WHERE c.ID = ? AND 
              m.DataCreazione BETWEEN STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s') AND STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')
        ORDER BY m.DataCreazione ASC;        
        ";

        $stmt = $this->conn->prepare($query);

        if ($stmt === false) {
            return json_encode(['error' => "Error preparing statement: " . $this->conn->error]);
        }

        // Assuming $conversationID is an integer and $date1, $date2 are dates
        $stmt->bind_param("iss", $conversationID, $date1, $date2);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $messagesData = array();

            while ($row = $result->fetch_assoc()) {
                // Store each message with both user ID and message content
                $messagesData[] = $row;
            }

            $stmt->close(); // Close the statement here

            return json_encode(['success' => $messagesData]);
        } else {
            $stmt->close(); // Close the statement in case of an error
            return json_encode(['error' => "Error executing statement: " . $stmt->error]);
        }
    }


    public function CheckIfNewMessages($conversationID, $LastMessageDate)
    {
        $query = "SELECT COUNT(m.ID) AS NewMessages, MAX(m.DataCreazione) AS LastMessage
        FROM conversazioni AS c
        JOIN messaggi AS m ON m.IDConversazione = c.ID
        WHERE C.ID = ? AND m.DataCreazione > STR_TO_DATE(?, '%Y-%m-%d')
        ";

        $stmt = $this->conn->prepare($query);

        if ($stmt === false) {
            return json_encode(['error' => "Error preparing statement: " . $this->conn->error]);
        }

        // Assuming $conversationID is an integer and $date1, $date2 are dates
        $stmt->bind_param("is", $conversationID, $LastMessageDate);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();

            $NMessages = $row["NewMessages"];
            $LastMessDate = $row["LastMessage"];

            if ($NMessages != 0) {
                $response = [
                    'success' => [
                        'newMessages' => $NMessages,
                        'lastMessageDate' => $LastMessDate
                    ]
                ];

                return json_encode($response);
            } else {
                return json_encode(['error' => "no new messages"]);
            }

            $stmt->close(); // Close the statement here


        } else {
            $stmt->close(); // Close the statement in case of an error
            return json_encode(['error' => "Error executing statement: " . $stmt->error]);
        }
    }

    // Retrieve messages by conversation ID
    public function GetMessagesByConversationID($conversationID)
    {
        $query = "SELECT m.IDUtente, m.Contenuto, m.DataCreazione
    FROM conversazioni as c
    JOIN messaggi as m ON m.IDConversazione = c.ID
    WHERE c.ID = ?
    ORDER BY m.DataCreazione ASC
    ";

        $stmt = $this->conn->prepare($query);

        if ($stmt === false) {
            return json_encode(['error' => "Error preparing statement: " . $this->conn->error]);
        }

        $stmt->bind_param("i", $conversationID);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $messagesData = array();

            while ($row = $result->fetch_assoc()) {
                // Store each message with both user ID and message content
                $messagesData[] = $row;
            }

            return json_encode(['success' => $messagesData]);
        } else {
            return json_encode(['error' => "Error executing statement: " . $stmt->error]);
        }

        $stmt->close();
    }



    public function SendMessage($content, $sender, $conversation)
    {
        // Assuming 'ID' is an auto-increment column, it is excluded from the column list
        $query = "INSERT INTO Messaggi (Contenuto, DataCreazione, IDUtente, IDConversazione) VALUES (?, NOW(), ?, ?)";

        $stmt = $this->conn->prepare($query);

        if ($stmt === false) {
            return json_encode(['error' => "Error preparing statement: " . $this->conn->error]);
        }

        $stmt->bind_param("sii", $content, $sender, $conversation);

        if ($stmt->execute()) {
            // Since 'ID' is auto-increment, it will be generated automatically
            $insertedId = $stmt->insert_id; // Getting the last inserted ID

            // Returning the ID of the inserted message
            return json_encode(['success' => "Message sent successfully.", 'id' => $insertedId]);
        } else {
            return json_encode(['error' => "Error executing statement: " . $stmt->error]);
        }

        // Closing the statement
        $stmt->close();
    }
}
