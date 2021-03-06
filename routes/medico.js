var express = require('express');

var app = express();

var mdAutentificacion = require('../middlewares/autentificacion');

var Medico = require('../models/medico');

// =====================================================
// Obtener todos los medicos
//======================================================
app.get('/', (req, res, next) => {
	var desde = req.query.desde || 0;
	desde = Number(desde);

	Medico.find({})
		.skip(desde)
		.limit(5)
		.populate('usuario', 'nombre email')
		.populate('hospital')
		.exec((err, medico) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error cargando medicos',
					errors: err
				});
			}
			Medico.count({}, (err, conteo) => {
				res.status(200).json({
					ok: true,
					medicos: medico,
					total: conteo
				});
			});
		});
});

// =====================================================
// Obtener un medico
//======================================================
app.get('/:id', (req, res) => {
	var id = req.params.id;

	Medico.findById(id)
		.populate('usuario', 'nombre email img')
		.populate('hospital')
		.exec((err, medico) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar medico',
					errors: err
				});
			}

			if (!medico) {
				return res.status(400).json({
					ok: false,
					mensaje: 'el medico con el id: ' + id + ' no existe',
					errors: { message: 'No existe un medico con ese ID.' }
				});
			}

			res.status(200).json({ ok: true, medico: medico });
		});
});

// =====================================================
// crear un nuevo medico
//======================================================
app.post('/', mdAutentificacion.verificaToken, (req, res) => {
	var body = req.body;

	console.log(req.usuario);

	var medico = new Medico({
		nombre: body.nombre,
		usuario: req.usuario,
		hospital: body.hospital
	});

	medico.save((err, medicoGuardado) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error guardado medico',
				errors: err
			});
		}

		res.status(201).json({
			ok: true,
			medico: medicoGuardado,
			usuarioToken: req.usuario
		});
	});
});

// =====================================================
// actualizar medico
//======================================================
app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {
	var id = req.params.id;
	var body = req.body;

	Medico.findById(id, (err, medicoDb) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar medico',
				errors: err
			});
		}

		if (!medicoDb) {
			return res.status(400).json({
				ok: false,
				mensaje: 'el medico con el id: ' + id + ' no existe',
				errors: { message: 'No existe un medico con ese ID.' }
			});
		}

		medicoDb.nombre = body.nombre;
		medicoDb.usuario = req.usuario._id;
		medicoDb.hospital = body.hospital;

		medicoDb.save((err, medicoGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Error al actualizar medico',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				medico: medicoGuardado
			});
		});
	});
});

// =====================================================
// eliminar un nuevo medico x id
//======================================================
app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {
	var id = req.params.id;
	var body = req.body;

	Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar medico',
				errors: err
			});
		}

		if (!medicoBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un medico con ese ID.',
				errors: { message: 'No existe un medico con ese ID.' }
			});
		}

		res.status(200).json({
			ok: true,
			medico: medicoBorrado
		});
	});
});

module.exports = app;
