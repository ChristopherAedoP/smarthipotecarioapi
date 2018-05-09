var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var simulacionSchema = new Schema(
	{
		rut: { type: String, required: [true, 'El	rut es necesario'] },
		tipoVivienda: { type: String },
		condicion: { type: String },
		valorPropiedadUF: { type: Number },
		plazoEntrega: { type: Number },
		pieUF: { type: Number },
		plazoCredito: { type: Number },
		estado: { type: String, default: 'PENDIENTE' }
	},
	{ collection: 'simulaciones' }
);

module.exports = mongoose.model('Simulacion', simulacionSchema);
