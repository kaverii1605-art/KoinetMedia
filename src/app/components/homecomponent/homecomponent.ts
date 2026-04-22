import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-homecomponent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('earthCanvas', { static: false }) earthCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  words: string[] = ['Global Reach', 'Better Leads', 'Brand Growth', 'More Sales'];
  currentWord: string = 'Global Reach';
  private wordIndex = 0;
  private intervalId: any;

  testimonials = [
    {
      text: 'Koinet Media helped us scale our outreach and boost lead quality significantly. A fantastic experience!',
      author: 'Mark Thompson'
    },
    {
      text: 'Their data-driven marketing approach increased our customer engagement by 45%. Highly recommend!',
      author: 'Lisa Carter'
    },
    {
      text: 'Exceptional service! Koinet Media played a key role in expanding our B2B network with qualified leads.',
      author: 'David Ramirez'
    }
  ];

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private earth!: THREE.Mesh;
  private glow!: THREE.Mesh;
  private animationId!: number;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.currentWord = this.words[this.wordIndex];
      this.cdr.detectChanges();
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.initEarth();
    this.animateEarth();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this.onResize);

    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initEarth(): void {
    const canvas = this.earthCanvas.nativeElement;

    this.scene = new THREE.Scene();

    const width = canvas.clientWidth || 500;
    const height = canvas.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 3.2;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);

    const textureLoader = new THREE.TextureLoader();

    // Use a real earth texture image here
    const earthTexture = textureLoader.load('assets/images/earth.jpg');

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 1,
      metalness: 0
    });

    this.earth = new THREE.Mesh(geometry, material);
    this.scene.add(this.earth);

    // Soft blue glow
    const glowGeometry = new THREE.SphereGeometry(1.08, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.12
    });

    this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(this.glow);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(3, 2, 4);
    this.scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x60a5fa, 0.7);
    backLight.position.set(-3, -1, -2);
    this.scene.add(backLight);
  }

  private animateEarth = (): void => {
    this.animationId = requestAnimationFrame(this.animateEarth);

    if (this.earth) {
      this.earth.rotation.y += 0.0045; // right to left realistic spin
    }

    if (this.glow) {
      this.glow.rotation.y += 0.0045;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
    if (!this.renderer || !this.camera || !this.earthCanvas) return;

    const canvas = this.earthCanvas.nativeElement;
    const width = canvas.clientWidth || 500;
    const height = canvas.clientHeight || 500;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };
}