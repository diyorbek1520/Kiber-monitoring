export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const publicMessage = getPublicMessage(error, status);

  console.error('API xatoligi:', {
    yol: req.originalUrl,
    status,
    xabar: error.message
  });

  res.status(status).json({
    xabar: publicMessage
  });
}

function getPublicMessage(error, status) {
  if (error.publicMessage) return error.publicMessage;
  if (status === 429) return 'OpenAI hisobida kvota yoki billing cheklovi bor';
  if (status === 401) return 'OpenAI API kaliti noto‘g‘ri yoki faol emas';
  if (error.message === 'Connection error.') return 'OpenAI xizmatiga ulanishda xatolik yuz berdi';
  return 'Ichki server xatoligi yuz berdi';
}
