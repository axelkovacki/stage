import yaml from 'yaml';
import fs from 'fs';
import Dockerode from 'dockerode';
import DockerodeCompose from 'dockerode-compose';

function getSubdomain(host: string | undefined) {
  if (!host) return '';

  const matches = host.split('.');
  if (!matches.length) return host;

  return matches[0];
}

function getPerformancesPath(target: string): string {
  return `${process.cwd()}/bucket/${target}.yaml`;
}

function getYaml(target: string): any {
  const stream = fs.readFileSync(getPerformancesPath(target), 'utf8');
  return yaml.parse(stream);
}

function setYaml(target: string, payload: any): void {
  const stream = yaml.stringify(payload);
  fs.writeFileSync(getPerformancesPath(target), stream, 'utf8');
}

async function getDockerContext(target: string, pull: boolean = true) {
  console.log(`> Initialize docker daemon by: ${target}`);
  const docker = new Dockerode();
  const compose = new DockerodeCompose(docker, getPerformancesPath(target), target);

  if (pull) {
    await compose.pull();
  }

  return await compose.up();
}

function getImutableServices(): String[] {
  try {
    let payload = JSON.parse(process.env.IMUTABLE_SERVICES);

    return payload;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export {
  getSubdomain,
  getYaml,
  setYaml,
  getDockerContext,
  getImutableServices
};
