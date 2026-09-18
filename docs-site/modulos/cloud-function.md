# Vinculación de Sala — Cloud Function

## ◆ Problema

	▸ findByInvitationCode necesitaba leer salas por código antes de unirse
	▸ Firestore Security Rules solo permitían leer salas siendo ya miembro
	▸ Bloqueaba el join: paradoja de necesitar acceso para poder pedir acceso

## ◆ Solución

	▸ Cloud Function callable findRoomByCode en backend/functions/src/salas/
	▸ Usa Admin SDK, evade Security Rules del cliente
	▸ Devuelve solo salaId, salaNombre, salaCodigoInvitacion (no salaMiembros ni salaAdminUid)
	▸ Security Rules de salas se mantienen estrictas, sin abrir lectura pública

## ◆ Piezas nuevas

	▸ backend/functions/src/index.ts — initializeApp() + export de la función
	▸ backend/functions/src/salas/findRoomByCode.ts — lógica de búsqueda
	▸ mobile/.../salas/data/dto/findRoomByCode.dto.ts — tipos de request/response
	▸ mobile/.../salas/domain/sala.schema.ts — nuevo SalaPreviewSchema (subset de Sala)
	▸ salas.repository.ts — findByInvitationCode ahora llama httpsCallable, no getDocs

## ◆ Flujo de vinculación probado

	▸ Dispositivo A crea sala, ve salaCodigoInvitacion en su Home
	▸ Dispositivo B ingresa el código en UnirseSalaScreen
	▸ unirse() en sala.store.ts: busca por función, joinRoom (arrayUnion), updateUserRoom
	▸ Ambos usuarios quedan con el mismo salaId en salaMiembros y en userSalaActualId

## ◆ Deploy de Functions

	▸ backend/functions/ usa npm, aislado del resto del proyecto que usa pnpm
	▸ Deploy: cd backend/functions && npm run build, luego cd .. && firebase deploy --only functions:findRoomByCode
	▸ Plan Blaze activo, con alerta de presupuesto configurada como red de seguridad