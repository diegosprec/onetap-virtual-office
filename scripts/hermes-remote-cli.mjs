#!/usr/bin/env node

const url = process.env.HERMES_BRIDGE_URL
  || 'http://onetap-hermes-cli-bridge:8766/execute';

const token = process.env.HERMES_BRIDGE_TOKEN;

if (!token) {
  console.error('HERMES_BRIDGE_TOKEN no configurado');
  process.exit(1);
}

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      args: process.argv.slice(2),
    }),
    signal: AbortSignal.timeout(125000),
  });

  if (!response.ok) {
    console.error(`Hermes bridge HTTP ${response.status}`);
    process.exit(1);
  }

  const result = await response.json();

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  process.exit(Number.isInteger(result.code) ? result.code : 1);

} catch (error) {
  console.error(`Hermes bridge: ${error.message}`);
  process.exit(1);
}
