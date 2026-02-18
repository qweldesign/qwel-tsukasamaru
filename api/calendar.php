<?php
/**
 * Calendar.php
 * © 2026 QWEL.DESIGN (https://qwel.design)
 * Released under the MIT License.
 * See LICENSE file for details.
 */

class Calendar {
  public function __construct($file = './status.sqlite') {
    $method = $_GET['method'];

    // ステータスの問い合わせ
    if ($method === 'fetch') {
      // APIのアクセス許可
      header("Access-Control-Allow-Origin: *");
      
      $result;

      // SQL文発行
      $year = isset($_GET['year']) ? $_GET['year'] : date('Y');
      $month = isset($_GET['month']) ? $_GET['month'] : date('n');
      // 実行
      $result = $this->fetchStatus($file, $year, $month);
      
      // JSON出力
      echo json_encode($result, JSON_UNESCAPED_UNICODE);
      return;

    } else {
      // リファラ確認
      $referer = $_SERVER['HTTP_REFERER'];
      $url = parse_url($referer);
      if (!stristr($url['host'], 'qwel.design')) return;

      // ステータスの挿入
      if ($method === 'insert') {
        if (isset($_POST['date']) && isset($_POST['state'])) {
          $this->insertState($file, $_POST['date'], $_POST['state']); 
        }
      
        return;
      }
      
      // ステータスの削除
      if ($method === 'delete') {
        if (isset($_POST['date'])) {
          $this->cleanState($file, $_POST['date']); 
        }
      
        return;
      }
    }
  }

  private function executeQuery($file, $sql, $options = []) {
    // DB接続
    $pdo = new PDO('sqlite:' . $file);

    // 設定
    // SQL実行時、エラーの代わりに例外を投げる
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // fetchAll時、カラム名をキーとする連想配列で取得
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    try {
      $stmt = $pdo->prepare($sql);
      $stmt->execute($options);

      $result = $stmt->fetchAll();

      return $result;

    } catch(PDOException $error) {
      // エラー処理
      echo $error->getMessage() . PHP_EOL;

    }
  }

  private function fetchStatus($file, $year, $month) {
    $sql = "SELECT * FROM t_status WHERE substr(date, 1, 7) = :date";
    $options = [
      ':date' => $year . '-' . sprintf('%02d', $month)
    ];

    return $this->executeQuery($file, $sql, $options);
  }

  private function insertState($file, $date, $state) {
    $sql = "INSERT INTO t_status(date, state) VALUES (:date, :state)";
    $options = [
      ':date' => $date,
      ':state' => $state
    ];

    return $this->executeQuery($file, $sql, $options);
  }

  private function cleanState($file, $date) {
    $sql = "DELETE FROM t_status WHERE date <= :date";
    $options = [
      ':date' => $date
    ];

    return $this->executeQuery($file, $sql, $options);
  }
}

new Calendar();
