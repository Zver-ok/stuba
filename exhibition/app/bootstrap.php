<?php
declare(strict_types=1);
date_default_timezone_set('Asia/Qyzylorda');
const APP_ROOT = __DIR__ . '/..';
const EVENT_NAME = 'KazAgroFarm';
const EVENT_DATES = '21–23 октября';
const EVENT_ADDRESS = 'МВЦ «EXPO», Мангилик Ел, 53/1, Астана';
const EVENT_STAND = 'C6';
const CONTACT_PHONE = '+7 777 555 06 65';
const CONTACT_WHATSAPP = '77775550665';
function e(mixed $value): string { return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function private_dir(): string {
    $path = getenv('EXHIBITION_DATA_DIR') ?: APP_ROOT . '/private';
    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) throw new RuntimeException('Cannot create private storage');
    return $path;
}
function database_config(): array {
    $file=private_dir().'/database.php';
    return is_file($file) ? require $file : ['driver'=>'sqlite'];
}
function connect_database(array $config): PDO {
    $options=[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES=>false];
    if (($config['driver']??'sqlite')==='mysql') {
        if (!extension_loaded('pdo_mysql')) throw new RuntimeException('PHP extension pdo_mysql is required');
        $dsn='mysql:host='.$config['host'].';port='.$config['port'].';dbname='.$config['database'].';charset=utf8mb4';
        $pdo=new PDO($dsn,$config['username'],$config['password'],$options);
        foreach ([
            "CREATE TABLE IF NOT EXISTS route_clicks (event_id CHAR(32) PRIMARY KEY, created_at VARCHAR(40) NOT NULL, day DATE NOT NULL, visitor CHAR(32) NOT NULL, placement VARCHAR(20) NOT NULL, INDEX route_clicks_day(day)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS visitors (visitor CHAR(32) NOT NULL, day DATE NOT NULL, views INT NOT NULL DEFAULT 1, started INT NOT NULL DEFAULT 0, source VARCHAR(120) NOT NULL DEFAULT '', medium VARCHAR(120) NOT NULL DEFAULT '', campaign VARCHAR(120) NOT NULL DEFAULT '', PRIMARY KEY(visitor,day)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS leads (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, created_at VARCHAR(40) NOT NULL, day DATE NOT NULL, visitor CHAR(32) NOT NULL, first_name VARCHAR(60) NOT NULL, last_name VARCHAR(60) NOT NULL, phone VARCHAR(20) NOT NULL UNIQUE, person_type VARCHAR(20) NOT NULL, company VARCHAR(150) NOT NULL DEFAULT '', interest VARCHAR(80) NOT NULL DEFAULT '', source VARCHAR(120) NOT NULL DEFAULT '', medium VARCHAR(120) NOT NULL DEFAULT '', campaign VARCHAR(120) NOT NULL DEFAULT '', consent_version VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'new', INDEX leads_day(day)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS login_attempts (address CHAR(64) NOT NULL, created_at BIGINT NOT NULL, INDEX attempts_address(address,created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS submit_attempts (address CHAR(64) NOT NULL, created_at BIGINT NOT NULL, INDEX submits_address(address,created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        ] as $sql) $pdo->exec($sql);
        return $pdo;
    }
    if (!extension_loaded('pdo_sqlite')) throw new RuntimeException('PHP extension pdo_sqlite is required');
    $pdo=new PDO('sqlite:'.private_dir().'/exhibition.sqlite',null,null,$options);
    $pdo->exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
    $pdo->exec('CREATE TABLE IF NOT EXISTS visitors (visitor TEXT NOT NULL, day TEXT NOT NULL, views INTEGER NOT NULL DEFAULT 1, started INTEGER NOT NULL DEFAULT 0, source TEXT NOT NULL DEFAULT "", medium TEXT NOT NULL DEFAULT "", campaign TEXT NOT NULL DEFAULT "", PRIMARY KEY(visitor,day));
    CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, day TEXT NOT NULL, visitor TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, person_type TEXT NOT NULL, company TEXT NOT NULL DEFAULT "", interest TEXT NOT NULL DEFAULT "", source TEXT NOT NULL DEFAULT "", medium TEXT NOT NULL DEFAULT "", campaign TEXT NOT NULL DEFAULT "", consent_version TEXT NOT NULL, status TEXT NOT NULL DEFAULT "new");
    CREATE TABLE IF NOT EXISTS route_clicks (event_id TEXT PRIMARY KEY, created_at TEXT NOT NULL, day TEXT NOT NULL, visitor TEXT NOT NULL, placement TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS route_clicks_day ON route_clicks(day);
    CREATE INDEX IF NOT EXISTS leads_day ON leads(day);
    CREATE TABLE IF NOT EXISTS login_attempts (address TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS attempts_address ON login_attempts(address,created_at);
    CREATE TABLE IF NOT EXISTS submit_attempts (address TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS submits_address ON submit_attempts(address,created_at);');
    @chmod(private_dir().'/exhibition.sqlite',0600);
    return $pdo;
}
function db(): PDO {
    static $pdo=null;
    return $pdo ??= connect_database(database_config());
}
function save_private_php(string $file, array $config): void {
    $temp=tempnam(private_dir(),'config-');
    chmod($temp,0600);
    if (file_put_contents($temp,"<?php\nreturn ".var_export($config,true).";\n",LOCK_EX)===false || !rename($temp,$file)) {
        @unlink($temp); throw new RuntimeException('Cannot save configuration');
    }
}
function session_start_safe(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $session_dir=private_dir().'/sessions';
    if (!is_dir($session_dir)) mkdir($session_dir,0700,true);
    session_save_path($session_dir);
    session_name('exhibition_session');
    session_set_cookie_params(['httponly'=>true, 'secure'=>isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'samesite'=>'Lax', 'path'=>'/']);
    ini_set('session.use_strict_mode', '1');
    session_start();
    if (!isset($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32));
}
function csrf(): string { session_start_safe(); return $_SESSION['csrf']; }
function valid_csrf(): bool { return isset($_POST['csrf']) && is_string($_POST['csrf']) && hash_equals(csrf(), $_POST['csrf']); }
function visitor_id(): string {
    if (isset($_SESSION['visitor'])) return $_SESSION['visitor'];
    $id=$_COOKIE['exhibition_visitor'] ?? '';
    if (!is_string($id) || !preg_match('/^[a-f0-9]{32}$/', $id)) $id=bin2hex(random_bytes(16));
    setcookie('exhibition_visitor',$id,['expires'=>time()+90*86400,'path'=>'/','secure'=>isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off','httponly'=>true,'samesite'=>'Lax']);
    return $_SESSION['visitor']=$id;
}
function text_input(array $input, string $key, int $max=120): string {
    $value=$input[$key]??'';
    if (!is_string($value)) return '';
    $value=trim(preg_replace('/[\x00-\x1F\x7F]/u','',$value) ?? '');
    return strlen($value)<=$max*4 && preg_match('/^.{0,'.$max.'}$/us',$value) ? $value : '';
}
function record_visit(): void {
    if (preg_match('/bot|crawler|spider|headless|preview/i',$_SERVER['HTTP_USER_AGENT']??'')) return;
    $id=visitor_id(); $day=date('Y-m-d');
    $utm=['source'=>text_input($_GET,'utm_source'),'medium'=>text_input($_GET,'utm_medium'),'campaign'=>text_input($_GET,'utm_campaign')];
    if ($utm['source']!=='' || $utm['campaign']!=='') $_SESSION['utm']=$utm;
    $utm=$_SESSION['utm']??$utm;
    $pdo=db();
    $upsert=$pdo->getAttribute(PDO::ATTR_DRIVER_NAME)==='mysql' ? ' ON DUPLICATE KEY UPDATE views=views+1' : ' ON CONFLICT(visitor,day) DO UPDATE SET views=views+1';
    $stmt=$pdo->prepare('INSERT INTO visitors(visitor,day,source,medium,campaign) VALUES(?,?,?,?,?)'.$upsert);
    $stmt->execute([$id,$day,$utm['source'],$utm['medium'],$utm['campaign']]);
}
function address_key(): string {
    $path=private_dir().'/analytics-key';
    $handle=fopen($path,'c+');
    if (!$handle || !flock($handle,LOCK_EX)) throw new RuntimeException('Cannot initialize rate limiting');
    $key=trim(stream_get_contents($handle));
    if ($key==='') { $key=bin2hex(random_bytes(32)); rewind($handle); fwrite($handle,$key); fflush($handle); }
    chmod($path,0600); flock($handle,LOCK_UN); fclose($handle);
    return hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',$key);
}
function admin_config(): ?array {
    $file=private_dir().'/admin.json';
    return is_file($file) ? json_decode(file_get_contents($file),true) : null;
}
function is_admin(): bool {
    session_start_safe();
    $config=admin_config();
    if (!$config || !isset($_SESSION['admin'],$_SESSION['admin_signature'],$_SESSION['last_active'])) return false;
    if (!hash_equals(hash('sha256',$config['password_hash']),$_SESSION['admin_signature']) || time()-$_SESSION['last_active']>3600) {
        unset($_SESSION['admin'],$_SESSION['admin_signature'],$_SESSION['last_active']); return false;
    }
    $_SESSION['last_active']=time(); return true;
}
function security_headers(): void {
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: DENY');
    header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; form-action 'self'; base-uri 'self'; frame-ancestors 'none'");
    header('Cache-Control: no-store');
}
if (PHP_SAPI !== 'cli') { security_headers(); session_start_safe(); }
