Write-Host "Congratulations! Your first script executed successfully"
#echo TESTE
rm -r technomar
git clone https://github.com/rfranciotti/raw-decoder.git technomar
cd technomar
npm install 
node index.js