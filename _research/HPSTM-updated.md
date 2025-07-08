---
title: "Human Pose Smoothing via Transformer Module for Robot Teleoperation"
collection: research
category: recent
status: unpublished
permalink: /research/HPSTM-updated
excerpt: 'A novel Transformer-based approach for smoothing 3D human pose trajectories in real-time teleoperation, addressing jitter and instability issues in markerless motion capture while maintaining temporal consistency for precise robotic control.'
date: 2025-03-15
paperurl: https://arxiv.org/abs/2506.17282
github_repo: https://github.com/Qifei-C/Human_Pose_Smoothing_Transformer_Module
dataset_url: https://github.com/Qifei-C/Human_Pose_Smoothing_Transformer_Module/tree/main/data
demo_url: https://github.com/Qifei-C/Human_Pose_Smoothing_Transformer_Module#demo
---

This research presents a Transformer-based smoothing module (HPSTM) designed to enhance the quality of 3D human pose trajectories for robot teleoperation applications.

## Abstract

Markerless human pose estimation enables flexible robotic teleoperation without cumbersome wearable devices, but current methods often produce jittery trajectories unsuitable for precise control. We introduce HPSTM, a Transformer-based module that leverages self-attention mechanisms to capture long-range temporal dependencies and produce smooth, consistent pose sequences in real-time.

## Key Features

- **Real-time Performance**: Processes pose sequences with minimal latency suitable for teleoperation
- **Transformer Architecture**: Utilizes self-attention to model complex temporal relationships
- **Uncertainty Awareness**: Incorporates per-joint confidence scores for adaptive smoothing
- **Plug-and-Play Design**: Compatible with various pose estimation backends

## Resources

- **GitHub Repository**: Complete source code, pre-trained models, and documentation
- **Dataset**: Training data with ground truth smooth trajectories
- **Demo Videos**: Real-world teleoperation examples with robotic arms

## Citation

```bibtex
@article{chen2025hpstm,
  title={Human Pose Smoothing via Transformer Module for Robot Teleoperation},
  author={Chen, Qifei and others},
  journal={arXiv preprint arXiv:2506.17282},
  year={2025}
}
```