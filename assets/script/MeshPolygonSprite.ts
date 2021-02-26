// author: http://lamyoung.com/

//@ts-ignore
const gfx = cc.gfx;

const { ccclass, property, executeInEditMode, requireComponent, menu } = cc._decorator;

@ccclass
@executeInEditMode
@requireComponent(cc.MeshRenderer)
@menu("lamyoung.com/MeshPolygonSprite")
export default class MeshPolygonSprite extends cc.Component {
    @property
    _offset: cc.Vec2 = cc.v2(0, 0)
    /**
     * !#en Position offset
     * !#zh 位置偏移量
     * @property offset
     * @type {Vec2}
     */
    get offset() {
        return this._offset;
    }
    @property({ type: cc.Vec2, tooltip: '位置偏移量' })
    set offset(value) {
        this._offset = value;
        this._updateMesh();
        this._applyVertexes();
    }

    @property
    _spriteFrame: cc.SpriteFrame = null;
    /**
    * !#en The sprite frame of the sprite.
    * !#zh 精灵的精灵帧
    * @property spriteFrame
    * @type {SpriteFrame}
    * @example
    * sprite.spriteFrame = newSpriteFrame;
    */
    get spriteFrame() {
        return this._spriteFrame;
    }
    @property({ type: cc.SpriteFrame, tooltip: '精灵的精灵帧' })
    set spriteFrame(value) {
        this._spriteFrame = value;
        this._refreshAll();
    }

    @property
    _vertexes: cc.Vec2[] = [cc.v2(0, 0), cc.v2(0, 100), cc.v2(100, 100), cc.v2(100, 0)]
    /**
     * !#en Position vertexes
     * !#zh 顶点坐标
     * @property vertexes
     * @type {Vec2}
     */
    get vertexes() {
        return this._vertexes;
    }
    @property({ type: cc.Vec2, tooltip: '顶点坐标' })
    set vertexes(value) {
        this._vertexes = value;
        this._updateMesh();
        this._applyVertexes();
    }

    private renderer: cc.MeshRenderer = null;
    private mesh: cc.Mesh = null;
    private _meshCache: { [key: number]: cc.Mesh } = {};

    onLoad() {
        this._meshCache = {};
        const renderer = this.node.getComponent(cc.MeshRenderer) || this.node.addComponent(cc.MeshRenderer);

        renderer.mesh = null;
        this.renderer = renderer;

        let builtinMaterial = cc.Material.getBuiltinMaterial("unlit");//createWithBuiltin("unlit");
        renderer.setMaterial(0, builtinMaterial);
    }

    onEnable() {
        this._refreshAll();
    }

    private _refreshAll() {
        this._updateMesh();
        this._applySpriteFrame();
        this._applyVertexes();
    }

    private _updateMesh() {
        
        // cc.log('_updateMesh')
        let mesh = this._meshCache[this.vertexes.length];
        if (!mesh) {
            mesh = new cc.Mesh();
            mesh.init(new gfx.VertexFormat([
                { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
                { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
            ]), this.vertexes.length, true);
            this._meshCache[this.vertexes.length] = mesh;
        }
        cc.log(mesh.nativeUrl)
        this.mesh = mesh;
    }

    private _lerp(a: number, b: number, w: number) {
        return a + w * (b - a);
    }


    // 更新顶点
    private _applyVertexes() {
        // cc.log('_applyVertexes');

        // 设置坐标
        const mesh = this.mesh;
        mesh.setVertices(gfx.ATTR_POSITION, this.vertexes);

        this._calculateUV();

        if (this.vertexes.length >= 3) {
            // 计算顶点索引 
            const ids = [];
            // 多边形切割 poly2tri，支持简单的多边形，确保顶点按顺序且不自交
            const countor = this.vertexes.map((p) => { return { x: p.x, y: p.y } });//[].concat(this.vertexes);
            const swctx = new poly2tri.SweepContext(countor, { cloneArrays: true });
            // cc.log('countor', countor.length, countor);
            try {
                // 防止失败 使用try 
                swctx.triangulate();
                // cc.log('triangulate');
                const triangles = swctx.getTriangles();
                // cc.log('triangles', triangles.length, triangles);

                triangles.forEach((tri) => {
                    tri.getPoints().forEach(p => {
                        const i = countor.indexOf(p as any);
                        ids.push(i);
                    });
                })
            } catch (e) {
                cc.error('poly2tri error', e);
            }

            if (ids.length === 0) {
                cc.log('计算顶点索引 失败');
                ids.push(...this.vertexes.map((v, i) => { return i }));
            }
            // cc.log('ids');
            // cc.log(ids);
            mesh.setIndices(ids);


            this.renderer.mesh = mesh;
        }
    }

    private _calculateUV() {
        const mesh = this.mesh;
        if (this.spriteFrame) {
            // cc.log('_calculateUV')
            //@ts-ignore
            const uv = this.spriteFrame.uv;
            const texture = this.spriteFrame.getTexture();
            /**
             *    t
             * l     r
             *    b
             */
            const uv_l = uv[0];
            const uv_r = uv[6];
            const uv_b = uv[3];
            const uv_t = uv[5];

            // cc.log('uv', uv)

            // 计算uv
            const uvs = [];
            for (const pt of this.vertexes) {
                const u = this._lerp(uv_l, uv_r, (pt.x + texture.width / 2 + this.offset.x) / texture.width);
                const v = this._lerp(uv_b, uv_t, (pt.y + texture.height / 2 - this.offset.y) / texture.height);
                uvs.push(cc.v2(u, v));
            }
            mesh.setVertices(gfx.ATTR_UV0, uvs);
        }
    }


    // 更新图片
    private _applySpriteFrame() {
        // cc.log('_applySpriteFrame');
        if (this.spriteFrame) {
            const renderer = this.renderer;
            let material = renderer.getMaterial(0);
            // Reset material
            let texture = this.spriteFrame.getTexture();
            material.define("USE_DIFFUSE_TEXTURE", true);
            material.setProperty('diffuseTexture', texture);
        }
    }
}


/*
https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ

*/

// 欢迎关注微信公众号[白玉无冰]

/**
█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄██▀▄ ▄▄██ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄▀▀▀█▄▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀▀ ▀▄▄ ▄ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄ █ █ ▀ ▀▄█▄▀████
████▀ ▄  █▄█▀█▄█▀█  ▀▄ █ ▀ ▄▄██▀█████
████ ▄▀▄▄▀▄ █▄▄█▄ ▀▄▀ ▀ ▀ ▀▀▀▄ █▀████
████▀ ██ ▀▄ ▄██ ▄█▀▄ ██▀ ▀ █▄█▄▀█████
████   ▄██▄▀ █▀▄▀▄▀▄▄▄▄ ▀█▀ ▀▀ █▀████
████ █▄ █ ▄ █▀ █▀▄█▄▄▄▄▀▄▄█▄▄▄▄▀█████
████▄█▄█▄█▄█▀ ▄█▄   ▀▄██ ▄▄▄ ▀   ████
████ ▄▄▄▄▄ █▄██ ▄█▀  ▄   █▄█  ▄▀█████
████ █   █ █ ▄█▄ ▀  ▀▀██ ▄▄▄▄ ▄▀ ████
████ █▄▄▄█ █ ▄▄▀ ▄█▄█▄█▄ ▀▄   ▄ █████
████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄▄█▄██████
█████████████████████████████████████
█████████████████████████████████████
 */