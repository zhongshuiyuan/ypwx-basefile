import * as Cesium from 'cesium';
import { ParticlesComputing } from './particlesComputing';
import { ParticlesRendering } from './particlesRendering';

export class ParticleSystem {
    context: any;
    data: any;
    userInput: any;
    viewerParameters: any;
    particlesComputing: any;
    particlesRendering: any;
    
    constructor(context: any, data: any, userInput: any, viewerParameters: any) {
        this.context = context;
        this.data = data;
        this.userInput = userInput;
        this.viewerParameters = viewerParameters;

        this.particlesComputing = new ParticlesComputing(
            this.context, this.data,
            this.userInput, this.viewerParameters
        );
        this.particlesRendering = new ParticlesRendering(
            this.context, this.data,
            this.userInput, this.viewerParameters,
            this.particlesComputing
        );
    }

    canvasResize(context: any) {
        this.particlesComputing.destroyParticlesTextures();
        Object.keys(this.particlesComputing.windTextures).forEach((key) => {
            this.particlesComputing.windTextures[key].destroy();
        }); 

        Object.keys(this.particlesRendering.framebuffers).forEach((key) => {
            this.particlesRendering.framebuffers[key].destroy();
        });

        this.context = context;
        this.particlesComputing = new ParticlesComputing(
            this.context, this.data,
            this.userInput, this.viewerParameters
        );
        this.particlesRendering = new ParticlesRendering(
            this.context, this.data,
            this.userInput, this.viewerParameters,
            this.particlesComputing
        );
    }

    clearFramebuffers() {
        var clearCommand = new Cesium.ClearCommand({
            color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
            depth: 1.0,
            framebuffer: undefined,
            pass: Cesium.Pass.OPAQUE
        });

        Object.keys(this.particlesRendering.framebuffers).forEach((key) => {
            clearCommand.framebuffer = this.particlesRendering.framebuffers[key];
            clearCommand.execute(this.context);
        });
    }

    refreshParticles(maxParticlesChanged: any) {
        this.clearFramebuffers();

        this.particlesComputing.destroyParticlesTextures();
        this.particlesComputing.createParticlesTextures(this.context, this.userInput, this.viewerParameters);

        if (maxParticlesChanged) {
            var geometry = this.particlesRendering.createSegmentsGeometry(this.userInput);
            this.particlesRendering.primitives.segments.geometry = geometry;
            var vertexArray = Cesium.VertexArray.fromGeometry({
                context: this.context,
                geometry: geometry,
                attributeLocations: this.particlesRendering.primitives.segments.attributeLocations,
                bufferUsage: Cesium.BufferUsage.STATIC_DRAW,
            });
            this.particlesRendering.primitives.segments.commandToExecute.vertexArray = vertexArray;
        }
    }

    applyUserInput(userInput: any) {
        var maxParticlesChanged = false;
        if (this.userInput.maxParticles !== userInput.maxParticles) {
            maxParticlesChanged = true;
        }

        Object.keys(userInput).forEach((key) => {
            this.userInput[key] = userInput[key];
        });
        this.refreshParticles(maxParticlesChanged);
    }

    applyViewerParameters(viewerParameters: any) {
        Object.keys(viewerParameters).forEach((key) => {
            this.viewerParameters[key] = viewerParameters[key];
        });
        this.refreshParticles(false);
    }
}