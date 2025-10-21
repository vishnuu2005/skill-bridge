# Make Existing User Admin
# This script will make your current registered user an admin

$email = Read-Host "Enter the email of the user you want to make admin"

Write-Host "`n🔍 Connecting to MongoDB..." -ForegroundColor Cyan

$mongoCommand = @"
use village_skill_portal
db.users.updateOne(
  { email: "$email" },
  { `$set: { isAdmin: true, isActive: true } }
)
print("✅ User updated to admin!")
db.users.findOne({ email: "$email" }, { name: 1, email: 1, isAdmin: 1, _id: 0 })
"@

$mongoCommand | mongosh

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ Done! User is now an admin!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now login with:" -ForegroundColor Yellow
Write-Host "Email: $email" -ForegroundColor Cyan
Write-Host "Password: [your existing password]" -ForegroundColor Cyan
Write-Host ""
Write-Host "You should see the purple 'Admin' link in the menu!" -ForegroundColor Magenta
Write-Host ""

pause
