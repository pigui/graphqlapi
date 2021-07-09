import { Test, TestingModule } from '@nestjs/testing';
import { BlogsResolver } from './blogs.resolver';

describe('BlogsResolver', () => {
  let resolver: BlogsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogsResolver],
    }).compile();

    resolver = module.get<BlogsResolver>(BlogsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
