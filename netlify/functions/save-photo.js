const fs = require("fs");
const path = require("path");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Метод не поддерживается",
    };
  }

  const data = JSON.parse(event.body);
  const base64Image = data.image;

  if (!base64Image) {
    return {
      statusCode: 400,
      body: "Изображение не получено",
    };
  }

  const timestamp = Date.now();
  const fileName = `photo-${timestamp}.html`;
  const htmlPath = path.resolve(__dirname, `../../html/${fileName}`);

  const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Фото ${timestamp}</title></head>
<body>
  <h2>Фото сделано: ${new Date(timestamp).toLocaleString()}</h2>
  <img src="${base64Image}" style="max-width:100%; border-radius:1em;">
</body>
</html>`;

  try {
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, htmlContent);

    return {
      statusCode: 200,
      body: `/html/${fileName}`,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Ошибка при сохранении файла: ${err}`,
    };
  }
};
