import test from 'node:test';
import assert from 'node:assert/strict';
import { filtrarProductos } from '../src/lib/catalogFilters.js';
const products=[{id:1,nombre:'Café molido',marca:'León',presentacion:'250 g',precio:12,publicado:true,disponible:true,subcategoria_id:5,subcategorias:{id:5,nombre:'Café',categorias:{id:3,nombre:'Despensa'}}},{id:2,nombre:'Azúcar',precio:3,publicado:true,disponible:false},{id:3,nombre:'Oculto',precio:1,publicado:false,disponible:true}];
test('búsqueda combina palabras y tolera tildes; ignora productos ocultos',()=>{assert.deepEqual(filtrarProductos(products,{search:'cafe leon 250'}).map(p=>p.id),[1]);assert.equal(filtrarProductos(products,{}).length,2);});
test('categoría, subcategoría, disponibilidad y precio se combinan',()=>{assert.deepEqual(filtrarProductos(products,{categoria:'3',subcategoria:'5',disponibles:true}).map(p=>p.id),[1]);assert.deepEqual(filtrarProductos(products,{orden:'precio-asc'}).map(p=>p.id),[2,1]);assert.equal(filtrarProductos(products,{categoria:'8'}).length,0);});

