<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__.'/bootstrap.php';
$username=$argv[1]??'admin';
if (!preg_match('/^[A-Za-z0-9_.-]{3,60}$/',$username)) { fwrite(STDERR,"Login must be 3–60 Latin characters\n"); exit(1); }
fwrite(STDERR,"Enter a new password (at least 12 characters) via stdin:\n");
$password=rtrim(fgets(STDIN)?:'',"\r\n");
if (strlen($password)<12) { fwrite(STDERR,"Password too short\n"); exit(1); }
$file=private_dir().'/admin.json';
$json=json_encode(['username'=>$username,'password_hash'=>password_hash($password,PASSWORD_DEFAULT)],JSON_THROW_ON_ERROR);
$temp=tempnam(private_dir(),'admin-'); chmod($temp,0600);
file_put_contents($temp,$json,LOCK_EX); rename($temp,$file);
fwrite(STDOUT,"Admin created. Existing admin sessions invalidated.\n");
