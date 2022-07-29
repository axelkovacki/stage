import { getYaml, setYaml, getDockerContext, getImutableServices } from './utils';

function notEnableToRename(key: string): boolean {
  return getImutableServices().includes(key);
}

function renameKey(target: string, key: string) {
  return `${key}-${target}`;
}

function renameImage(target: string, image: string): string {
  return image.indexOf(':') ? `${image.split(':')[0]}:${target}`: `${image}:${target}`;
}

function renameIndexesOfTemplate(target: string, template: any) {
  let custom = template;

  for (const key in custom.services) {
    if (notEnableToRename(key)) {
      continue;
    }
    
    const newKey = renameKey(target, key);
    const image = renameImage(target, custom.services[key].image);

    custom.services[newKey] = {
      ...custom.services[key],
      image
    }

    delete custom.services[key];
  }

  return custom;
}

function createTemplete(target: string): void {
  let template = getYaml('template');
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