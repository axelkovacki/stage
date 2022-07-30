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

function getComposePath(target: string): string {
  return `${process.cwd()}/compose/${target}.yaml`;
}

function getYaml(target: string): any {
  const stream = fs.readFileSync(getComposePath(target), 'utf8');
  return yaml.parse(stream);
}

function setYaml(target: string, payload: any): void {
  const stream = yaml.stringify(payload);
  fs.writeFileSync(getComposePath(target), stream, 'utf8');
}

async function getDockerContext(target: string, pull: boolean = true) {
  console.log(`> Initialize docker daemon by: ${target}`);
  const docker = new Dockerode();
  const compose = new DockerodeCompose(docker, getComposePath(target), target);

  if (pull) {
    await compose.pull();
  }

  return await compose.up();
}

function getImutableServicesNames(): String[] {
  try {
    let payload = JSON.parse(process.env.IMUTABLE_SERVICES_NAMES);
    return payload;
  } catch (err) {
    console.log(err);
    return [];
  }
}

function getImutableServicesImages(): String[] {
  try {
    let payload = JSON.parse(process.env.IMUTABLE_SERVICES_IMAGES);
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
  getImutableServicesNames,
  getImutableServicesImages
};
