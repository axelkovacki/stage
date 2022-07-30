import { getYaml, setYaml, getDockerContext, getImutableServicesNames, getImutableServicesImages } from './utils';

function existInImuatableServicesNames(key: string): boolean {
  return getImutableServicesNames().includes(key);
}

function existInImutableServicesImages(key: string): boolean {
  return getImutableServicesImages().includes(key);
}

function renameKey(target: string, key: string) {
  return `${key}-${target}`;
}

function renameImage(target: string, image: string): string {
  return image.indexOf(':') ? `${image.split(':')[0]}:${target}` : `${image}:${target}`;
}

function renameIndexesOfTemplate(target: string, template: any) {
  let custom = template;

  for (const key in custom.services) {
    let { image } = custom.services[key];

    if (existInImutableServicesImages(key)) {
      continue;
    }

    let newKey = !existInImuatableServicesNames(key) ? renameKey(target, key) : key;

    custom.services[newKey] = {
      ...custom.services[key],
      image: renameImage(target, image)
    }

    if (key === newKey) {
      continue;
    }

    delete custom.services[key];
  }

  return custom;
}

function createTemplete(target: string): void {
  let template = getYaml('docker-compose');
  template = renameIndexesOfTemplate(target, template);
  setYaml(target, template);
}

async function run(target: string) {
  const context = await getDockerContext(target);
  return context;
}

async function up(target: string) {
  try {
    createTemplete(target);
    // await run(target);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default {
  up
}