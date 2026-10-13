const driver = document.querySelector('#database-driver');
const fields = document.querySelector('#mysql-fields');
function updateDriver() {
  const mysql = driver.value === 'mysql';
  fields.hidden = !mysql;
  fields.querySelectorAll('input').forEach(input => { input.disabled = !mysql; input.required = mysql && input.name !== 'db_password'; });
}
driver?.addEventListener('change', updateDriver);
if (driver) updateDriver();
