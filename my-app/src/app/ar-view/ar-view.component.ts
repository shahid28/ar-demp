import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.css'],
})
export class ArViewComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private reticle!: THREE.Mesh;
  private controller!: THREE.Group;
  private hitTestSource: any = null;
  private hitTestSourceRequested = false;
  private loadedModel: THREE.Group | null = null;

  ngAfterViewInit(): void {
    this.init();
    this.animate();
  }

  private init(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    document.body.appendChild(
      ARButton.createButton(this.renderer, {
        requiredFeatures: ['hit-test'],
      })
    );

    const geometry = new THREE.RingGeometry(0.07, 0.09, 32).rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.reticle = new THREE.Mesh(geometry, material);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);

    const loader = new GLTFLoader();
    loader.load(
      'assets/Duck.glb',
      (gltf: { scene: THREE.Group }) => {
        this.loadedModel = gltf.scene;
        this.loadedModel.scale.set(0.2, 0.2, 0.2);
      },
      undefined,
      (error: unknown) => console.error(error)
    );

    this.controller = this.renderer.xr.getController(0);
    (this.controller as any).addEventListener('select', () => this.onSelect());
    this.scene.add(this.controller);
  }

  private onSelect(): void {
    if (this.reticle.visible && this.loadedModel) {
      const modelClone = this.loadedModel.clone();
      modelClone.position.setFromMatrixPosition(this.reticle.matrix);
      this.scene.add(modelClone);
      
      // Add rotation animation
      const animateRotation = () => {
        if (modelClone) {
          modelClone.rotation.y += 0.01; // Rotate 0.01 radians per frame
          requestAnimationFrame(animateRotation);
        }
      };
      animateRotation();
    }
  }

  private animate(): void {
    this.renderer.setAnimationLoop((timestamp: number, frame: XRFrame) => this.render(timestamp, frame));
  }

  private render(timestamp: number, frame: XRFrame): void {
    if (frame) {
      const referenceSpace = this.renderer.xr.getReferenceSpace();
      const session = this.renderer.xr.getSession();

      if (!this.hitTestSourceRequested) {
        if (session) {
          // @ts-ignore
          session.requestReferenceSpace('viewer').then((viewerSpace: any) => {
            // @ts-ignore
            session.requestHitTestSource({ space: viewerSpace }).then((source: any) => {
              this.hitTestSource = source;
            });
          });

          session.addEventListener('end', () => {
            this.hitTestSourceRequested = false;
            this.hitTestSource = null;
          });
        }
        this.hitTestSourceRequested = true;
      }

      if (this.hitTestSource) {
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);
        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          if (referenceSpace) {
            const pose = hit.getPose(referenceSpace as XRSpace);
            if (pose) {
              this.reticle.visible = true;
              this.reticle.matrix.fromArray(pose.transform.matrix);
            }
          }
        } else {
          this.reticle.visible = false;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
