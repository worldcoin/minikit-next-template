'use client';

import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from '@worldcoin/minikit-js';

import { useCallback, useState } from 'react';

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyPayload: VerifyCommandInput = {
  action: 'vota-por-proyecto', // Asegúrate que coincida con tu acción real
  signal: '',
  verification_level: VerificationLevel.Orb,
};

export const VerifyBlock = () => {
  const [mensaje, setMensaje] = useState<string>('Esperando verificación...');
  const [respuesta, setRespuesta] = useState<MiniAppVerifyActionErrorPayload | IVerifyResponse | null>(null);

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      setMensaje('❌ MiniKit no está instalado. Abre esta MiniApp desde World App.');
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        console.error('Error al ejecutar comando de verificación:', finalPayload);
        setMensaje('❌ Verificación cancelada o fallida.');
        setRespuesta(finalPayload);
        return;
      }

      const response = await fetch(`/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: verifyPayload.action,
          signal: verifyPayload.signal,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setMensaje('✅ Verificación exitosa');
      } else {
        const errorCode = json?.verifyRes?.error_code || 'desconocido';
        setMensaje(`❌ Verificación fallida. Código: ${errorCode}`);
      }

      setRespuesta(json);
    } catch (err) {
      console.error('Error inesperado durante la verificación:', err);
      setMensaje('❌ Error inesperado durante la verificación.');
    }
  }, []);

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="text-xl font-bold mb-2">Verificación de Identidad</h2>
      <p className="mb-2">{mensaje}</p>
      <button
        onClick={handleVerify}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Verificar con World ID
      </button>

      {respuesta && (
        <pre className="text-sm text-left mt-4 bg-gray-100 p-2 rounded max-w-md overflow-auto">
          {JSON.stringify(respuesta, null, 2)}
        </pre>
      )}
    </div>
  );
};
