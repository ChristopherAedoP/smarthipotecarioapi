var express = require('express');

var app = express();

var mdAutentificacion = require('../middlewares/autentificacion');

var Simulacion = require('../models/simulacion');

// =====================================================
// Obtener todos los simulaciones
//======================================================
app.get('/', (req, res, next) => {
	var desde = req.query.desde || 0;
	desde = Number(desde);

	Simulacion.find({})
		.skip(desde)
		.limit(5)
		// .populate('usuario', 'nombre email')
		.exec((err, simulacion) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error cargando simulaciones',
					errors: err
				});
			}

			Simulacion.count({}, (err, conteo) => {
				res.status(200).json({
					ok: true,
					simulaciones: simulacion,
					total: conteo
				});
			});
		});
});

// =====================================================
// crear un nuevo simulacion
//======================================================
app.post('/', (req, res) => {
	var body = req.body;

	var simulacion = new Simulacion({
		rut: body.rut,
		tipoVivienda: body.tipoVivienda,
		condicion: body.condicion,
		valorPropiedadUF: body.valorPropiedadUF,
		plazoEntrega: body.plazoEntrega,
		pieUF: body.pieUF,
		plazoCredito: body.plazoCredito,
		estado: body.estado
	});

	simulacion.save((err, simulacionGuardado) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error guardado simulacion',
				errors: err
			});
		}

		res.status(201).json({ ok: true, simulacion: simulacionGuardado });
	});
});

// =====================================================
// actualizar simulacion
//======================================================
app.put('/:id', (req, res) => {
	var id = req.params.id;
	var body = req.body;

	Simulacion.findById(id, (err, simulacionDb) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar simulacion',
				errors: err
			});
		}

		if (!simulacionDb) {
			return res.status(400).json({
				ok: false,
				mensaje: 'el simulacion con el id: ' + id + ' no existe',
				errors: { message: 'No existe un simulacion con ese ID.' }
			});
		}

		simulacionDb.rut = body.rut;
		simulacionDb.tipoVivienda = body.tipoVivienda;
		simulacionDb.condicion = body.condicion;
		simulacionDb.valorPropiedadUF = body.valorPropiedadUF;
		simulacionDb.plazoEntrega = body.plazoEntrega;
		simulacionDb.pieUF = body.pieUF;
		simulacionDb.plazoCredito = body.plazoCredito;
		simulacionDb.estado = body.estado;

		// simulacionDb.usuario = req.usuario._id;

		simulacionDb.save((err, simulacionGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al actualizar simulacion',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				simulacion: simulacionGuardado
			});
		});
	});
});

// =====================================================
// eliminar un nuevo simulacion x id
//======================================================
app.delete('/:id', (req, res) => {
	var id = req.params.id;

	Simulacion.findByIdAndRemove(id, (err, simulacionBorrado) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar simulacion',
				errors: err
			});
		}

		if (!simulacionBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un simulacion con ese ID.',
				errors: { message: 'No existe un simulacion con ese ID.' }
			});
		}

		res.status(200).json({
			ok: true,
			simulacion: simulacionBorrado
		});
	});
});

//==========================================
//Obtener simulacion por ID
//==========================================

app.get('/:id', (req, res) => {
	var id = req.params.id;

	Simulacion.findById(id)
		// .populate('usuario', 'nombre img email')
		.exec((err, simulacion) => {
			if (err) {
				returnres.status(500).json({
					ok: false,
					mensaje: 'Error al buscar simulacion',
					errors: err
				});
			}

			if (!simulacion) {
				return res.status(400).json({
					ok: false,
					mensaje: 'El simulacion con el id ' + id + ' no existe',
					errors: { message: 'No existe un simulacion con ese ID' }
				});
			}

			res.status(200).json({ ok: true, simulacion: simulacion });
		});
});

module.exports = app;
