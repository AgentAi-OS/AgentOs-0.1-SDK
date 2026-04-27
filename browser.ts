import { AgentOSClient } from 'agent-os-0.1-sdk';

const agentOS = new AgentOSClient({
  baseUrl: 'https://agent-os-0.1-lime.vercel.app'
});

agentOS.events.on('terminal:command', ({ command, exitCode }) => {
  console.log(`Terminal command "${command}" finished with exit code ${exitCode}`);
});

await agentOS.openApp('terminal');
const terminalResult = await agentOS.runTerminalCommand('status');
console.log(terminalResult.output);

await agentOS.openApp('tokenCreator');
const tokenDraft = await agentOS.createTokenDraft({
  name: 'Agent Token',
  symbol: 'AGENT',
  supply: 1_000_000,
  decimals: 9,
  description: 'Utility token draft for AGENT OS'
});
console.log(tokenDraft);
